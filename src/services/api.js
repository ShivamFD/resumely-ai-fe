import axios from 'axios';

// Create axios instance with base configuration
// For Vite, we need to use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for AI processing
});

// Request interceptor to modify requests before they are sent
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here (e.g., authorization headers)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error responses here
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
const endpoints = {
  // Upload resume and get analysis
  uploadResume: (file, onProgress) => {
    const formData = new FormData();
    formData.append('resume', file);

    return api.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(progress);
        }
        console.log(`Upload Progress: ${progress}%`);
      },
    });
  },

  // Get analytics/stats (if needed)
  getAnalytics: () => {
    return api.get('/analytics');
  },
};

export default endpoints;