import React from "react";
import AuthInfoPanel from "./AuthInfoPanel";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative">
      {/* Background image and overlay */}
      <img
        src="/assets/bg.jpg"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover object-center z-0 pointer-events-none select-none"
      />
      <div
        className={`fixed inset-0 z-0 transition-colors duration-300`}
        aria-hidden="true"
      />
      {/* Main content: left and right panels */}
      <div className="relative z-10 flex w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl items-stretch min-h-[500px]">
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
              &copy; {new Date().getFullYear()} Amberos. All rights reserved.
            </div>
          </div>
        </div>
      </div>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-30 bg-white/80 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 shadow hover:scale-105 transition-transform text-gray-800 dark:text-gray-100"
        aria-label="Toggle dark/light mode"
      >
        {isDarkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
};

export default AuthLayout; 