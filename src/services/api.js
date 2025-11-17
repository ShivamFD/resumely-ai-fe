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
  // Upload resume and get analysis (with cache)
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
    }).then(response => {
      // Validate and check the response data before returning
      console.log('API Response received:', response.data);

      // Check if the response has the expected structure
      if (response.data) {
        const { strengths, weaknesses, missingSkills, summary, jobFitScore } = response.data;

        // Validate the structure exists
        const hasValidStructure = Array.isArray(strengths) &&
                                 Array.isArray(weaknesses) &&
                                 Array.isArray(missingSkills) &&
                                 typeof summary === 'string' &&
                                 typeof jobFitScore === 'number';

        if (!hasValidStructure) {
          console.warn('Response has invalid structure, returning default data:', response.data);
          return {
            data: {
              strengths: ["Resume analysis in progress", "Processing your resume content"],
              weaknesses: ["Initial analysis", "Please try again if results seem incomplete"],
              missingSkills: ["Skills will be analyzed", "Technical skills", "Soft skills"],
              summary: "We're analyzing your resume. Please check back for detailed feedback.",
              jobFitScore: 50,
              processingTime: response.data.processingTime || Date.now(),
              cached: response.data.cached || false
            }
          };
        }
      }

      return response;
    }).catch(error => {
      console.error('API Error in uploadResume:', error);
      // Return a default error response with proper structure
      throw {
        ...error,
        response: {
          ...error.response,
          data: {
            strengths: ["Error processing request", "Please try again"],
            weaknesses: ["Connection issue", "Check your internet connection"],
            missingSkills: ["Skills could not be analyzed", "AI processing failed"],
            summary: "An error occurred while analyzing your resume. Please try uploading again.",
            jobFitScore: 0,
            processingTime: 0,
            cached: false,
            error: error.response?.data?.error || "Upload failed. Please try again."
          }
        }
      };
    });
  },

  // Upload resume and get fresh analysis (bypass cache and DB)
  uploadResumeFresh: (file, onProgress) => {
    const formData = new FormData();
    formData.append('resume', file);

    return api.post('/upload-fresh', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(progress);
        }
        console.log(`Upload Progress: ${progress}%`);
      },
    }).then(response => {
      // Validate and check the response data before returning
      console.log('Fresh API Response received:', response.data);

      // Check if the response has the expected structure
      if (response.data) {
        const { strengths, weaknesses, missingSkills, summary, jobFitScore } = response.data;

        // Validate the structure exists
        const hasValidStructure = Array.isArray(strengths) &&
                                 Array.isArray(weaknesses) &&
                                 Array.isArray(missingSkills) &&
                                 typeof summary === 'string' &&
                                 typeof jobFitScore === 'number';

        if (!hasValidStructure) {
          console.warn('Fresh response has invalid structure, returning default data:', response.data);
          return {
            data: {
              strengths: ["Resume analysis in progress", "Processing your resume content"],
              weaknesses: ["Initial analysis", "Please try again if results seem incomplete"],
              missingSkills: ["Skills will be analyzed", "Technical skills", "Soft skills"],
              summary: "We're analyzing your resume. Please check back for detailed feedback.",
              jobFitScore: 50,
              processingTime: response.data.processingTime || Date.now(),
              cached: response.data.cached || false
            }
          };
        }
      }

      return response;
    }).catch(error => {
      console.error('API Error in uploadResumeFresh:', error);
      // Return a default error response with proper structure
      throw {
        ...error,
        response: {
          ...error.response,
          data: {
            strengths: ["Error processing request", "Please try again"],
            weaknesses: ["Connection issue", "Check your internet connection"],
            missingSkills: ["Skills could not be analyzed", "AI processing failed"],
            summary: "An error occurred while analyzing your resume. Please try uploading again.",
            jobFitScore: 0,
            processingTime: 0,
            cached: false,
            error: error.response?.data?.error || "Upload failed. Please try again."
          }
        }
      };
    });
  },

  // Get analytics/stats (if needed)
  getAnalytics: () => {
    return api.get('/analytics');
  },
};

export default endpoints;