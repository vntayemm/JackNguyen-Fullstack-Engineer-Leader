import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/domain-validator', label: 'Domain Validator' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex flex-col items-start space-y-1 hover:opacity-80 transition-opacity">
              <img src="/assets/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                DNS/Email Security Tool
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation (Hamburger Menu) */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* User Dropdown */}
          <div className="flex items-center space-x-4">
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
          onClick={closeMobileMenu}
        >
          <div 
            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex-1">{item.label}</span>
                  {isActive(item.path) && (
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
              ))}
              
              {/* Profile Link */}
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/profile')
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="flex-1">Profile</span>
                {isActive('/profile') && (
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
            </div>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>DNS/Email Security Tool</p>
                <p className="mt-1 text-xs">Version 1.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 