# Frontend Documentation — AI Resume Analyzer (React 19 + Vite)

This document outlines the **frontend development plan** for the AI Resume Analyzer web app built using **React 19**, designed for high performance, maintainability, and seamless backend integration.

---

## 🎯 Objective

To build a modern, responsive, and efficient frontend interface for the **AI Resume Analyzer**, where users can:

1. Upload resumes (PDF/DOCX)
2. View AI analysis (strengths, weaknesses, missing skills)
3. Experience smooth animations, lazy loading, and fast interactions.

---

## 🧩 Tech Stack

* **Framework:** React 19 (Vite)
* **Routing:** React Router DOM
* **State Management:** Zustand + React Query
* **Animations:** Framer Motion
* **Notifications:** React Toastify
* **Icons:** React Icons
* **HTTP Client:** Axios
* **Performance Tools:** Lazy Loading, Skeleton Loaders, Code Splitting

---

## 📁 Folder Structure

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── UploadForm.jsx
│   │   ├── AnalysisResult.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   └── Result.jsx
│   ├── hooks/
│   │   ├── useUpload.js
│   │   └── useAnalysis.js
│   ├── context/
│   │   └── store.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Initialize Project

```bash
npm create vite@latest ai-resume-analyzer-frontend --template react
cd ai-resume-analyzer-frontend
npm install
```

### 2️⃣ Install Dependencies

```bash
npm install react-router-dom axios framer-motion react-toastify react-query zustand react-icons
npm install -D eslint prettier vite-plugin-compression
```

### 3️⃣ Setup Environment File

Create `.env` file in root:

```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🎨 UI/UX Flow

### **Home Page**

* Introduction section with animated hero (Framer Motion)
* CTA button → “Upload Resume”

### **Upload Page**

* File input with drag-and-drop zone
* On submit → call `/api/upload` (backend)
* Show skeleton loader while waiting for AI analysis

### **Result Page**

* Display structured feedback (strengths, weaknesses, missing skills)
* Animated appearance using Framer Motion
* Option to “Upload Another Resume”

### **Global Components**

* Navbar (fixed top)
* Toast notifications (React Toastify)
* Reusable Button & Card components

---

## 🧠 State Management

### **Zustand Store Example:** `store.js`

```js
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  analysisData: null,
  setAnalysisData: (data) => set({ analysisData: data }),
  resetData: () => set({ analysisData: null }),
}));
```

### **React Query Integration:**

Used for API calls + caching analysis results.

```js
import { useMutation } from 'react-query';
import axios from 'axios';

export const useAnalyzeResume = () => {
  return useMutation(async (formData) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);
    return res.data;
  });
};
```

---

## 💡 Performance Optimizations

* **Lazy Loading**: `React.lazy()` + `Suspense` for pages not in initial viewport.
* **Skeleton Loader**: Only for visible area during data fetching.
* **Framer Motion**: Animate route transitions + results.
* **React Query**: Caching results to avoid redundant API calls.
* **Code Splitting**: Auto handled by Vite for faster builds.

---

## 🧱 7-Day Frontend Roadmap

### **Day 1 — Setup & Config**

* Initialize Vite + React project
* Configure routing, linting, environment variables

### **Day 2 — Layout + Navigation**

* Create Navbar, Layout, basic routes (Home, Upload, Result)
* Setup Framer Motion for transitions

### **Day 3 — Upload Flow + API Integration**

* Create upload form + axios service
* Connect backend `/api/upload`
* Display loader during analysis

### **Day 4 — Result Page + Zustand Integration**

* Display AI feedback in cards
* Add Zustand for storing analyzed data

### **Day 5 — Skeletons + Lazy Loading + Toasts**

* Add skeleton loader for visible area
* Lazy load Result and Upload pages
* Add success/error toasts

### **Day 6 — UI Enhancements + Responsive Design**

* Polish design using modern card layout
* Test responsiveness (mobile, tablet, desktop)
* Optimize animations

### **Day 7 — Deployment + Cleanup**

* Optimize build with Vite compression
* Deploy to Netlify/Vercel
* Final testing + documentation update

---

## 🧩 Key Dependencies Overview

| Category      | Package                 | Purpose                 |
| ------------- | ----------------------- | ----------------------- |
| Routing       | react-router-dom        | Manage app routes       |
| API           | axios                   | Backend communication   |
| Animation     | framer-motion           | Smooth transitions      |
| Notifications | react-toastify          | User feedback           |
| State         | zustand                 | Global state management |
| Data fetching | react-query             | API caching + retry     |
| Icons         | react-icons             | Visual icons            |
| Performance   | vite-plugin-compression | Optimize build size     |

---

## 🚀 Deployment

* **Platform:** Vercel or Netlify
* **Build Command:** `npm run build`
* **Publish Directory:** `dist`
* **Env Variables:**

  * `VITE_API_URL` → Backend deployed URL

---

## 🔮 Future Enhancements

* Dark/Light theme toggle
* User authentication (save history)
* PDF export of AI analysis
* Shareable result link
* Custom prompts based on job role

---

**Outcome:** A modern, responsive, and production-ready frontend integrated with the AI-powered backend, featuring optimized performance, smooth animations, and scalable architecture.
