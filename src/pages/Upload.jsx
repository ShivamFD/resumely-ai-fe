import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import AnalysisResult from '../components/AnalysisResult';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = (data) => {
    setAnalysisResult(data);
    setError('');
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setAnalysisResult(null);
    console.error('Upload error:', errorMessage);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFileName('');
    setError('');
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setFileName(file.name);
    setError('');

    try {
      // In a real implementation, you would call the API here
      // For now, this is handled by the UploadForm component
    } catch (err) {
      handleUploadError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-medium">Error:</span> {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {analysisResult ? (
          <AnalysisResult
            analysis={analysisResult}
            fileName={fileName}
            onReset={handleReset}
          />
        ) : (
          <UploadForm
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Upload;