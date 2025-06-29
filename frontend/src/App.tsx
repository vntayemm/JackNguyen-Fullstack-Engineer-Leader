import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import UserDropdown from './components/UserDropdown';
import FloatingButtons from './components/FloatingButtons';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterSuccess from './pages/auth/RegisterSuccess';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/account/Dashboard';
import Profile from './pages/account/Profile';
import DomainValidator from './pages/DomainValidator';
import Document from './pages/Document';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import DNSCharts from './components/DNSCharts';
import { apiService } from './services/api';
import config from './config';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { token, user, setUser } = useAuth();
  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    // Only fetch profile if:
    // - There is a token
    // - User exists
    // - User profile is incomplete
    // - We haven't fetched profile in this session
    if (
      token &&
      user &&
      (!user.firstName && !user.lastName) &&
      !hasFetchedProfile.current
    ) {
      hasFetchedProfile.current = true;
      apiService.getProfile()
        .then(userProfile => {
          setUser({
            ...user,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName
          });
        })
        .catch(() => {
          // Optionally handle error
        });
    }
  }, [user, setUser]);

  // If not authenticated, show auth pages
  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account/dashboard" element={<Dashboard />} />
            <Route path="/domain-validator" element={<DomainValidator />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/charts" element={<DNSCharts />} />
            <Route path="/document" element={<Document />} />
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
              &copy; {new Date().getFullYear()} <a href="https://amberos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Amberos Pte. Ltd</a>. All rights reserved. | <a href="mailto:enquiries@amberos.com" className="text-blue-600 dark:text-blue-400 hover:underline">enquiries@amberos.com</a> | <a href={`${config.apiUrl}/api/docs`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">API Document</a>
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