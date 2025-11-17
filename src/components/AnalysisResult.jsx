import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AnalysisResult = ({ analysis, fileName, onReset }) => {
  const scoreRef = useRef(null);
  const summaryRef = useRef(null);
  const strengthsRef = useRef(null);
  const weaknessesRef = useRef(null);
  const missingSkillsRef = useRef(null);
  const recommendationsRef = useRef(null);

  useEffect(() => {
    // Animate the job fit score with a count-up effect
    if (scoreRef.current && analysis?.jobFitScore) {
      gsap.fromTo(
        scoreRef.current,
        { innerText: 0 },
        {
          innerText: analysis.jobFitScore,
          duration: 1.5,
          roundProps: "innerText",
          ease: "power2.out"
        }
      );
    }

    // Stagger animation for results sections
    const tl = gsap.timeline();
    tl.fromTo(
      [summaryRef.current, strengthsRef.current, weaknessesRef.current],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      }
    );

    // Animate missing skills and recommendations on scroll
    gsap.fromTo(
      missingSkillsRef.current,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: missingSkillsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(
      recommendationsRef.current,
      { x: 30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: recommendationsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [analysis]);
  const {
    strengths = [],
    weaknesses = [],
    missingSkills = [],
    summary = '',
    jobFitScore = 0,
    processingTime,
    cached,
    error
  } = analysis || {};

  // Check if we have empty or invalid data
  const hasEmptyData = (!strengths || strengths.length === 0) &&
                       (!weaknesses || weaknesses.length === 0) &&
                       (!missingSkills || missingSkills.length === 0) &&
                       (!summary || summary.trim() === '') &&
                       (jobFitScore === 0);

  // If there's an error in the response, show error message
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Analysis Results</h1>
          <p className="text-gray-600">For: <span className="font-semibold">{fileName}</span></p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Analysis Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If data seems empty but no error, provide guidance
  if (hasEmptyData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Analysis Results</h1>
          <p className="text-gray-600">For: <span className="font-semibold">{fileName}</span></p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Limited Analysis {(cached ? " (Cached)" : "")}</h3>
          <p className="text-yellow-700 mb-4">
            The AI was unable to extract meaningful information from your resume.
            This can happen if the file is password-protected, contains only images, or has complex formatting.
          </p>
          <div className="text-left bg-white p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Recommended Actions:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Try uploading a different resume file</li>
              <li>Ensure your resume contains text content (not scanned images)</li>
              <li>Try a PDF or DOCX format if you used a different format</li>
              <li>Check that your file is not password-protected</li>
              {cached && (
                <li className="text-red-600 font-medium">
                  Cached result detected - try uploading again to force fresh analysis
                </li>
              )}
            </ul>
          </div>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Upload Different Resume
          </button>
        </div>
      </div>
    );
  }

  // Calculate score color based on jobFitScore
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate score interpretation
  const getScoreInterpretation = (score) => {
    if (score >= 90) return 'Exceptional! Your resume stands out from the competition.';
    if (score >= 80) return 'Excellent! Your resume is well-aligned with market standards.';
    if (score >= 70) return 'Good! Your resume has strong elements with minor improvements needed.';
    if (score >= 60) return 'Fair. Your resume has some good points but needs improvement.';
    if (score >= 40) return 'Needs Improvement. Several areas require attention.';
    return 'Poor. Significant improvements needed to be competitive.';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Analysis Results</h1>
        <p className="text-gray-600">Detailed feedback for: <span className="font-semibold">{fileName}</span></p>
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center mb-8 shadow-lg">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-8 border-white flex items-center justify-center text-4xl font-bold" ref={scoreRef}>
              {jobFitScore}
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4">Job Fit Score</h2>
        <p className="text-blue-100 mt-2">{getScoreInterpretation(jobFitScore)}</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md" ref={summaryRef}>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-md" ref={strengthsRef}>
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Strengths
          </h3>
          {strengths && strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No specific strengths identified in this analysis.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-xl p-6 shadow-md" ref={weaknessesRef}>
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Areas for Improvement
          </h3>
          {weaknesses && weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No specific weaknesses identified in this analysis.</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      {missingSkills && missingSkills.length > 0 && (
        <div className="bg-white rounded-xl p-6 mt-8 shadow-md" ref={missingSkillsRef}>
          <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Missing Skills
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {missingSkills.map((skill, index) => (
              <li key={index} className="bg-yellow-50 text-yellow-800 px-3 py-2 rounded-lg flex items-center">
                <span className="mr-2">•</span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl p-6 mt-8">
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {processingTime !== undefined && (
            <div>
              <span className="font-medium">Processing Time:</span> {processingTime}ms
            </div>
          )}
          {cached !== undefined && (
            <div>
              <span className="font-medium">Cached Response:</span> {cached ? 'Yes' : 'No'}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              toast.info('Preparing for new analysis...');
              onReset();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Analyze Another Resume
          </button>

          <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium">
            Download Report (PDF)
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-xl p-6 mt-8" ref={recommendationsRef}>
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Personalized Recommendations
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Add quantifiable achievements with specific numbers and metrics</li>
          <li>• Include relevant keywords from job descriptions in your field</li>
          <li>• Consider updating your professional summary to reflect current goals</li>
          <li>• Add or emphasize technical skills that are in demand for your target roles</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisResult;