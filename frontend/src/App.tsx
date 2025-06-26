import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import DomainValidator from './pages/DomainValidator';
import SPFAnalyzer from './pages/SPFAnalyzer';
import DMARCAnalyzer from './pages/DMARCAnalyzer';
import DNSResolver from './pages/DNSResolver';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import FloatingButtons from './components/FloatingButtons';
import AuthInfoPanel from './components/AuthInfoPanel';
import UserDropdown from './components/UserDropdown';
import { apiService } from './services/api';
import config from './config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Navigation component with active state logic
const Navigation: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/domain-validator', label: 'Domain Validator' },
    { path: '/spf', label: 'SPF Analyzer' },
    { path: '/dmarc', label: 'DMARC Analyzer' },
    { path: '/dns', label: 'DNS Resolver' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <>
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
        className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40 relative">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

const AppContent: React.FC = () => {
  const { token, user, setUser } = useAuth();
  const hasFetchedProfile = useRef(false);

  // Fetch user profile if we have a token but incomplete user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Only fetch if we have a token, user exists, and we haven't fetched profile yet
      if (token && user && (!user.firstName && !user.lastName) && !hasFetchedProfile.current) {
        try {
          console.log('Fetching user profile to get complete user data...');
          console.log('Current user data:', user);
          console.log('API URL:', config.apiUrl);
          
          hasFetchedProfile.current = true;
          const userProfile = await apiService.getProfile();
          console.log('User profile fetched successfully:', userProfile);
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
          });
          // Reset the flag so we can try again later
          hasFetchedProfile.current = false;
        }
      }
    };

    fetchUserProfile();
  }, [token, user]); // Removed setUser from dependencies

  // Reset the flag when user changes
  useEffect(() => {
    hasFetchedProfile.current = false;
  }, [user?.id]);

  // If not authenticated, show auth pages
  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // If authenticated, show main app
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
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
            
            <Navigation />
            
            {/* User Dropdown */}
            <div className="flex items-center space-x-4">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/domain-validator" element={<DomainValidator />} />
            <Route path="/spf" element={<SPFAnalyzer />} />
            <Route path="/dmarc" element={<DMARCAnalyzer />} />
            <Route path="/dns" element={<DNSResolver />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>DNS/Email Security Tool</p>
            <p className="mt-1">
              Comprehensive tools for testing and validating DNS records, SPF, and DMARC configurations
            </p>
            <div className="mt-2 flex justify-center space-x-4 text-xs">
              <Link to="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </Link>
              <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Amberos. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <FloatingButtons />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App; 