import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-blue-600 text-white font-bold text-xl px-3 py-2 rounded-lg">
                RA
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800 hidden sm:block">
                Resumely AI
              </span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-300"
            >
              Analyze Resume
            </Link>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-300"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center">
            <Link
              to="/upload"
              className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;