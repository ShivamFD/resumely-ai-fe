import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedHero from '../components/AnimatedHero';
import UploadForm from '../components/UploadForm';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnimatedHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622V21l2-2V19c6.176-1.332 10-6.03 10-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">AI Analysis</h3>
            <p className="text-gray-600">
              Advanced AI technology analyzes your resume like a hiring manager would,
              identifying key strengths and areas for improvement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Detailed Feedback</h3>
            <p className="text-gray-600">
              Get comprehensive feedback on strengths, weaknesses, missing skills,
              and a professional summary of your resume.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Results</h3>
            <p className="text-gray-600">
              Receive detailed analysis within seconds. No need to wait for human review.
            </p>
          </div>
        </div>

        {/* Testimonials or Stats */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Users Trust Our AI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">40K+</div>
              <div className="text-gray-600">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Availability</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Resume?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their career prospects with our AI analysis.
          </p>
          <Link
            to="/upload"
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300 inline-block shadow-lg"
          >
            Upload Your Resume Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;