# AI Resume Analyzer - Frontend

This is the frontend for the AI Resume Analyzer application built with React 19, Vite, and Tailwind CSS. It provides an intuitive and interactive interface for users to upload their resumes and receive AI-powered analysis.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design following best practices
- **Drag & Drop Upload**: Intuitive resume upload with drag-and-drop support
- **Real-time Analysis**: Instant feedback on resume strengths and weaknesses
- **Professional Results Display**: Structured presentation of AI analysis
- **File Validation**: Support for PDF, DOC, and DOCX formats (max 5MB)
- **Progress Tracking**: Visual feedback during upload and analysis
- **Job Fit Score**: Numerical score with interpretation and recommendations

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Icons**: SVG Icons

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── UploadForm.jsx
│   ├── AnalysisResult.jsx
│   ├── Navbar.jsx
│   └── ...
├── pages/              # Route-based pages
│   ├── Home.jsx
│   ├── Upload.jsx
│   └── Result.jsx
├── services/           # API services
│   └── api.js
├── hooks/             # Custom hooks
├── utils/             # Utility functions
└── assets/            # Static assets
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚦 API Integration

The frontend connects to the backend API at `/api/upload` for resume analysis. The following endpoints are used:

- `POST /api/upload` - Upload resume and get AI analysis
- `GET /api/analytics` - Get system analytics (if needed)

## 🎨 UI Components

### Upload Form
- Drag and drop interface
- File validation and preview
- Upload progress tracking
- Error handling and feedback

### Analysis Results
- Job Fit Score visualization
- Strengths and weakness sections
- Missing skills identification
- Professional summary
- Personalized recommendations

### Navigation
- Responsive navbar with mobile support
- Clear navigation between pages
- Consistent design language

## 📱 Responsive Design

The application is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1200px+)

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The production build will be created in the `dist` folder.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.