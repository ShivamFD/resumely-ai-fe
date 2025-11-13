<!-- # AI Resume Analyzer — Production Documentation (MERN + OpenAI)

> Comprehensive, production-ready documentation to build, deploy, and operate the **AI Resume Analyzer** using the **MERN** stack with OpenAI integration. Covers architecture, components, API flows, scaling, security, monitoring, cost-control, testing, and operational runbook.

---

## Table of Contents

1. Project overview
2. Goals & non-goals
3. High-level architecture
4. Component design

   * Frontend (React)
   * Backend (Node/Express)
   * Storage & cache (MongoDB + Redis)
   * AI integration (OpenAI)
   * Key rotation and provider failover
5. Data flow (end-to-end)
6. API specification
7. File processing & text extraction
8. Prompt design & response parsing
9. Rate limiting, batching & token management
10. Resilience & fault-handling
11. Security & privacy
12. Observability & monitoring
13. Deployment & infra suggestions
14. CI/CD, testing, and QA
15. Cost control & optimization
16. Operational runbook & SRE notes
17. Roadmap & optional features
18. Appendix: snippets & configs

---

## 1. Project overview

**Purpose**: Allow users to upload resumes (PDF/DOCX/TXT), analyze them with an LLM to extract strengths, weaknesses, missing skills, role-fit suggestions, and produce actionable recommendations. Provide a clean UI, history, exportable reports, and admin controls.

**Primary users**: Job seekers, career coaches, recruiters.

**Non-goals**: Live chat bot for interviews (out-of-scope for v1), resume rewriting as a separate paid feature (optional later).

---

## 2. Goals & non-goals

**Goals**

* Production-grade APIs with key rotation and failover.
* Secure file handling (temporary storage, auto-delete).
* Scalable & cost-aware LLM usage.
* Clear, maintainable frontend with React hooks + light state management.
* Observability and alerts for SLA.

**Non-goals (v1-b)**

* Processing gigabytes of files per request.
* Running heavy LLMs locally.

---

## 3. High-level architecture

```
Client (React)  <--HTTPS-->  API Gateway / Load Balancer  <--->  Node/Express App(s)
                                         |                          |
                                  Redis (shared)              MongoDB Atlas
                                         |                          |
                                  OpenAI API (multiple keys)
                                         |
                               Optional fallback (HF / local)
```

Key points:

* Stateless app servers behind LB: persist session/usage in Redis/Mongo.
* Use Redis for cache, in-memory key state (cooldowns), rate-limiting, and job queue.
* Use a job queue (BullMQ/bee-queue) for heavy tasks (large resume parsing, long LLM calls).
* Store only necessary user data and hashed IDs; delete raw files after processing.

---

## 4. Component design

### Frontend (React)

**Tech**: React (18+), Vite, TypeScript (recommended), Tailwind CSS, React Query (TanStack Query) or SWR for server-state, Zustand or Redux Toolkit for light client-side state if needed.

**Structure**:

* `App.jsx` / `App.tsx` — global providers (React Query, Router, Toasts)
* `pages/UploadPage` — upload form, file validation, preview
* `components/AnalyzeResult` — cards for strengths/weaknesses/skills
* `hooks/useAnalyze` — encapsulates API calls + upload progress
* `hooks/useAuth` — (if login) JWT handling, refresh logic
* `services/api.ts` — axios instance with interceptors (attach token)

**UX flows**:

1. Upload file (client-side validation: file type, size)
2. Submit → optimistic UI: store pending job id
3. Poll / subscribe to job status (via WebSocket/Server-Sent Events) or use client polling with exponential backoff
4. Render results once ready
5. Allow export (PDF), save to history, and feedback

**Performance**:

* Use chunked upload for large files (optional S3 presigned URLs)
* Show fine-grained progress (upload % + analyze %)

### Backend (Node/Express)

**Tech**: Node 18+, Express, TypeScript, multer or busboy (for uploads), pdf-parse, mammoth, textract, OpenAI official client, axios, BullMQ (with Redis).

**Responsibilities**:

* Accept uploads (multipart/form-data)
* Quick client validation (size/type)
* Enqueue heavy tasks to worker (text extraction & LLM calls)
* Manage API key rotation and retries
* Persist results & history
* Admin endpoints to manage keys and view metrics

**Services**:

* `UploadService` — handles safe temp storage, virus/mime checks
* `ExtractService` — extracts text reliably (pdf -> text, docx -> text)
* `LLMService` — wraps calls to OpenAI and handles rotation/fallback
* `QueueWorker` — background worker processing jobs from Redis queue
* `AuthService` — JWT-based auth if required

### Storage & cache (MongoDB + Redis)

* **MongoDB**: user records, job metadata, analysis results (structured + raw LLM response), audit logs (anonymized if needed)
* **Redis**: key rotation state (cooldown timestamps), rate-limit counters, queue for background tasks (BullMQ), short-lived caches (recent jobs), session store if needed

Data retention policy: remove uploaded files immediately after text extraction; keep analysis JSON for configurable period (e.g., 90 days) unless user requests deletion.

### AI integration (OpenAI)

* Keep keys only server-side — never in frontend.
* Use per-request model selection to manage cost (e.g., `gpt-4o-mini` or `gpt-3.5-turbo` for cheaper responses; `gpt-4` for paid premium results).
* Add instructions to LLM to return strict JSON; implement robust parsing fallback.

### Key rotation and provider failover

* Maintain `OPENAI_KEYS` comma-separated (or better: store in secrets manager and admin DB table).
* Implement `KeyManager` class (in-memory + Redis-backed for multiple instances) with:

  * `getNextKey()` (round-robin / least-used)
  * `markError(keyId, severity)` to set cooldown with exponential backoff
  * `disableKeyPermanently(keyId)` for 401/403
  * persistence in Redis: `{keyId: {errorCount, disabledUntil}}`
* If all OpenAI keys fail, optional fallback to Hugging Face hosted model (if configured).

---

## 5. Data flow (end-to-end)

1. **Client** uploads file to `/api/upload` (or directly to S3 via presigned URL)
2. **API** validates file and enqueues a job `processResume(jobId)` in Redis queue
3. **Worker** pops job, extracts text, sanitizes, computes token estimate
4. Worker calls `LLMService` using `KeyManager` to get `analysis` JSON
5. Worker saves `analysis` to MongoDB and deletes temp file
6. API notifies client via WebSocket or client polls `/api/jobs/{jobId}`
7. Client fetches result and displays it

This job-queue pattern ensures UI remains responsive and heavy tasks (file parsing + LLM calls) don't block request threads.

---

## 6. API specification

### Public endpoints (authenticated optional)

* `POST /api/upload` — upload resume (returns `{ jobId }`)
* `GET /api/jobs/:jobId` — get job status/result
* `GET /api/history` — list previous analyses for user
* `POST /api/export/:jobId` — export PDF/markdown report

### Admin endpoints

* `GET /admin/keys` — view key status
* `POST /admin/keys` — add new OpenAI key
* `POST /admin/disable-key/:keyId`
* `GET /admin/metrics` — usage & failures

**Request/Response contract**

* Job model stored in MongoDB:

```json
{
  "_id": "jobId",
  "userId": "uid",
  "status": "queued|processing|done|failed",
  "inputFile": { "name": "cv.pdf", "size": 12345 },
  "result": { "strengths": [], "weaknesses": [], "missingSkills": [] },
  "rawModelResponse": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 7. File processing & text extraction

**Steps**

1. Upload validation (MIME type whitelist: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`)
2. Temporary storage → `uploads/<jobId>`; set TTL to auto-delete
3. For PDF: run `pdf-parse`. If PDF is scanned (image-based), optionally run OCR (Tesseract) — but OCR is expensive; mark as optional.
4. For DOCX: use `mammoth` or `docx` parser
5. Clean extracted text: remove repeated whitespace, remove headers/footers (heuristic), redact emails/phones if not needed
6. Summarize / chunk text if extremely long — keep only relevant sections (summary + experience bullets) to reduce token usage

**Safety**: never store raw file longer than necessary; redact PII in persistent records if not required.

---

## 8. Prompt design & response parsing

**Prompt principles**

* Be explicit: *Return valid JSON only.*
* Provide schema and examples in the system message.
* Limit output size by requesting arrays of strings with concise items.

**Example prompt**

```
You are an assistant that analyzes a resume. Return valid JSON ONLY with keys:
- strengths: array of short strings
- weaknesses: array of short strings
- missingSkills: array of short strings
- fit: overall role-fit score 0-100
- suggestedHeadline: string (one-line)

Resume text:
<EXTRACTED TEXT>

Return only JSON.
```

**Parsing**

* Try `JSON.parse`. If that fails, extract the first `{ ... }` block and parse.
* If still fails, fallback to regex-based extraction of fields.
* Persist raw model output for audit and retraining.

**Prompt tuning**

* Create a small test-suite of 50 varied resumes to tune prompt and validate JSON reliability.

---

## 9. Rate limiting, batching & token management

* Implement per-user rate limits (Redis token bucket). Example: 5 analyses per day for free users.
* Implement system-wide concurrency limit for LLM calls (limit parallel outgoing requests to OpenAI to avoid bursts)
* Chunk long resumes: if tokens estimated > threshold (e.g., 8000 tokens), then summarize and send summary or split into multiple calls and combine results.
* Track per-key token usage (approx) locally to steer `KeyManager` toward keys with less usage.

---

## 10. Resilience & fault-handling

**Key rotation**: already described — mark keys with cooldowns on 429/503, permanently disable on 401.

**Retries**: For transient errors retry with exponential backoff. Do not retry on 4xx client errors.

**Isolation**: Long processing should run in worker processes; if worker crashes, job is re-queued.

**Circuit breaker**: Use `opossum` or custom to disable LLM calls when downstream health is failing.

---

## 11. Security & privacy

* TLS everywhere (HTTPS)
* Store secrets in a managed secrets manager (AWS Secrets Manager, GCP Secret Manager, Vercel secrets)
* Content security policy on frontend
* Scan uploaded files for malware (optional third-party scanning)
* Access control: jobs belong to userId; only user or admin can fetch results
* Logging: redact PII in logs and limit retention
* Data retention: default 90 days for history; provide `Delete my data` endpoint to comply with GDPR-like requests

---

## 12. Observability & monitoring

**Metrics** (Prometheus/Grafana or Cloud watch)

* Requests/sec, 4xx/5xx rates
* LLM call latency, success/failures per key
* Queue length and worker throughput
* Redis memory & evictions

**Logs**: structured logs (JSON) to ELK / Datadog with request-id tracing

**Alerts**

* Key failure > 3 keys in 5 minutes
* Queue length > threshold
* 5xx rate spike

---

## 13. Deployment & infra suggestions

**Minimal infra (low-cost)**

* Frontend: Vercel/Netlify
* Backend: Render / Railway / Fly.io (one or more instances), or containerized on ECS/Fargate
* MongoDB: Atlas free tier
* Redis: Upstash (serverless) or small managed Redis

**Production infra (scalable)**

* Kubernetes (EKS/GKE) with Horizontal Pod Autoscaler for backend
* Managed Redis (ElastiCache/MemoryDB) and managed MongoDB Atlas cluster
* Use S3 (or equivalent) for files with presigned URLs; lifecycle rules for deletion
* API Gateway + ALB for SSL/edge caching

**Secrets**: store keys in secrets manager, not env files in production.

---

## 14. CI/CD, testing, and QA

**CI**: GitHub Actions

* Lint (ESLint/Prettier), type-check (tsc), unit tests, integration tests
* Build docker images and push to registry

**CD**: Auto-deploy staging on merge to `main` and production on tagged release

**Tests**

* Unit tests for `KeyManager`, `ExtractService`, `LLMService` (mocked)
* Integration: end-to-end using test resumes and mock OpenAI responses
* Load test: simulate concurrent users & LLM slowdowns

---

## 15. Cost control & optimization

* Use cheaper models for free-tier users (3.5 / small) and premium models for paid users
* Cap tokens per request; summarize long resumes client-side or server-side
* Cache repeated requests for same resume hash for short period
* Track token spend per user & rate-limit
* Consider rate-based pricing for heavy usage

---

## 16. Operational runbook & SRE notes

**Common incidents**

1. **All LLM keys failing**: check OpenAI dashboard; check key rotation logs; enable fallback provider; notify team
2. **Queue backlog**: scale worker count; throttle new uploads; communicate degraded mode to UI
3. **High error rates (5xx)**: rollback recent deploy; inspect logs and increase replicas

**Daily checks**

* Redis memory & eviction rate
* Queue lengths
* Key errors & token spend

---

## 17. Roadmap & optional features

* Role matching: compare resume to job description (similarity scoring)
* Resume rewrite / suggested bullet points (paid)
* Interview question generator based on resume
* Team/org analytics (for recruiters)
* Multilingual resume support

---

## 18. Appendix: snippets & configs

### Example `KeyManager` (concept)

```js
// See KeyManager pattern: getNextKey, markError, disable, requestWithRotation
```

### Example prompt (concise)

```
Return valid JSON only. {
  "strengths": [""],
  "weaknesses": [""],
  "missingSkills": [""],
  "fit": 0,
  "suggestedHeadline": ""
}
Resume text: <text>
```

### Example job queue config (BullMQ)

* Redis connection
* Queue name: `resume-processing`
* Worker concurrency: 2–5 (start small)

---

# Getting started (step-by-step quickstart)

1. Create repo with `frontend/` and `backend/` folders
2. Setup backend with Express, TypeScript, BullMQ, pdf-parse, mammoth
3. Implement simple `/api/upload` that stores file in `uploads/` and enqueues a job
4. Implement worker that extracts text and returns a mocked analysis (for UI development)
5. Build React UI to upload + poll job status
6. Wire OpenAI with `KeyManager` and replace mock with real LLM calls
7. Add Redis for key state & queue; add MongoDB for job persistence
8. Add admin endpoints and alerts
9. Deploy to staging and run end-to-end tests
10. Deploy to production, enable monitoring and billing alerts

---

If you want, I can:

* Generate a ready-to-use repo scaffold (backend + frontend) with key rotation and queue wiring.
* Provide exact code for `analyze` controller + worker + React hooks.
* Create a deployment checklist with Terraform/CloudFormation snippets.

Tell me which of the above you want next: **(A)** full repo scaffold, **(B)** backend code + worker, **(C)** frontend UI + hooks, **(D)** deployment scripts. -->











