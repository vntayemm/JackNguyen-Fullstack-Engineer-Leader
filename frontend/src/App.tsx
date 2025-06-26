import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token } = useAuth();

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
              <Link to="/dashboard" className="text-xl font-bold dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                DNS/Email Security Tool
              </Link>
                        </div>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                          <Link
                            to="/domain-validator"
                            className="dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Domain Validator
                          </Link>
                          <Link
                            to="/spf"
                            className="dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            SPF Analyzer
                          </Link>
                          <Link
                            to="/dmarc"
                            className="dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            DMARC Analyzer
                          </Link>
                          <Link
                            to="/dns"
                            className="dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            DNS Resolver
                          </Link>
                        </nav>
            {/* User Dropdown */}
            <div className="flex items-center space-x-4">
              <UserDropdown />
                        {/* Hamburger Icon for Mobile */}
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
            </div>
                      </div>
                    </div>
                  </header>

                  {/* Mobile Navigation (Hamburger Menu) */}
                  {mobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40 relative">
                      <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className="block dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Dashboard
            </Link>
                        <Link
                          to="/domain-validator"
                          onClick={closeMobileMenu}
                          className="block dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                          Domain Validator
                        </Link>
                        <Link
                          to="/spf"
                          onClick={closeMobileMenu}
                          className="block dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                          SPF Analyzer
                        </Link>
                        <Link
                          to="/dmarc"
                          onClick={closeMobileMenu}
                          className="block dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                          DMARC Analyzer
                        </Link>
                        <Link
                          to="/dns"
                          onClick={closeMobileMenu}
                          className="block dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                          DNS Resolver
                        </Link>
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="block dark:text-gray-300 hover:dark:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Profile
            </Link>
                      </div>
                    </div>
                  )}

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
            <Route path="*" element={<Dashboard />} />
                      </Routes>
                    </div>
                  </main>

                  {/* Footer */}
                  <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                      <div className="text-center text-sm dark:text-gray-400">
            <p>DNS/Email Security Tool</p>
                        <p className="mt-1">
                          Comprehensive tools for testing and validating DNS records, SPF, and DMARC configurations
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