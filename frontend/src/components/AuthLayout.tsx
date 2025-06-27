import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthInfoPanel from "./AuthInfoPanel";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import config from "../config";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  // Check if current route is a specific auth page
  const isAuthPage = ['/login', '/register', '/forgot-password', '/verify-email'].includes(location.pathname);

  // Show form directly for specific auth pages, show info panel for other routes
  useEffect(() => {
    setShowInfoPanel(!isAuthPage);
  }, [location.pathname, isAuthPage]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative">
      {/* Background image and overlay */}
      <img
        src="/assets/bg.jpg"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover object-center z-0 pointer-events-none select-none"
        style={{ backgroundRepeat: 'no-repeat' }}
      />
      <div
        className={`fixed inset-0 z-0 transition-colors duration-300`}
        aria-hidden="true"
      />
      
      {/* Mobile: Single column layout */}
      <div className="md:hidden relative z-10 flex flex-col w-full min-h-screen">
        {/* Mobile header with logo and theme toggle */}
        <div className="flex items-center justify-between p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <img src="/assets/logo.png" alt="Logo" className="h-8" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              {showInfoPanel ? 'Login' : 'Show Info'}
            </button>
            <button
              onClick={toggleTheme}
              className="w-8 h-8 p-1.5 bg-white/80 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-full shadow hover:scale-105 transition-transform flex items-center justify-center"
              aria-label="Toggle dark/light mode"
            >
              <span className="text-sm">{isDarkMode ? "🌙" : "☀️"}</span>
            </button>
          </div>
        </div>

        {/* Mobile info panel (collapsible) */}
        {showInfoPanel && (
          <div className="h-[calc(100vh-64px)] bg-black/50 backdrop-blur-sm">
            <AuthInfoPanel onClose={() => setShowInfoPanel(false)} />
          </div>
        )}

        {/* Mobile form area */}
        {!showInfoPanel && (
          <div className="h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className="w-full max-w-sm">
              {children}
              {/* Terms and Privacy links */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 md:mt-6">
                <span>Our </span>
                <Link to="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </Link>
                <span> and </span>
                <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
                <span>.</span>
              </div>
              {/* Copyright text */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                &copy; {new Date().getFullYear()} <a href="https://amberos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Amberos Pte. Ltd</a>. All rights reserved. | <a href="mailto:enquiries@amberos.com" className="text-blue-600 dark:text-blue-400 hover:underline">enquiries@amberos.com</a> | <a href={`${config.apiUrl}/api/docs`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">API Document</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Two column layout */}
      <div className="hidden md:flex relative z-10 w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl items-stretch min-h-[500px]">
        {/* Left: Info panel */}
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900">
          <AuthInfoPanel />
        </div>
        {/* Right: Form card */}
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900 relative">
          <div className="w-full max-w-md px-10 pt-10 pb-4 flex flex-col justify-center">
            <img src="/assets/logo.png" alt="Logo" className="h-14 mx-auto mb-6" />
            {children}
            {/* Terms and Privacy links */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              <span>Our </span>
              <Link to="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </Link>
              <span> and </span>
              <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
              <span>.</span>
            </div>
            {/* Copyright text */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} <a href="https://amberos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Amberos Pte. Ltd</a>. All rights reserved. | <a href="mailto:enquiries@amberos.com" className="text-blue-600 dark:text-blue-400 hover:underline">enquiries@amberos.com</a> | <a href={`${config.apiUrl}/api/docs`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">API Document</a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop theme toggle button */}
      <button
        onClick={toggleTheme}
        className="hidden md:block fixed bottom-6 right-6 z-30 bg-white/80 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 shadow hover:scale-105 transition-transform text-gray-800 dark:text-gray-100"
        aria-label="Toggle dark/light mode"
      >
        {isDarkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
};

export default AuthLayout; 