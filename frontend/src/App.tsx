import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import DomainValidator from './pages/DomainValidator';
import SPFAnalyzer from './pages/SPFAnalyzer';
import DMARCAnalyzer from './pages/DMARCAnalyzer';
import DNSResolver from './pages/DNSResolver';
import { ThemeProvider } from './contexts/ThemeContext';
import FloatingButtons from './components/FloatingButtons';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold dark:text-white">
                      DNS/Email Security Testing
                    </h1>
                  </div>
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex space-x-8">
                    <Link
                      to="/"
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
            </header>

            {/* Mobile Navigation (Hamburger Menu) */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40 relative">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/"
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
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <Routes>
                  <Route path="/" element={<DomainValidator />} />
                  <Route path="/spf" element={<SPFAnalyzer />} />
                  <Route path="/dmarc" element={<DMARCAnalyzer />} />
                  <Route path="/dns" element={<DNSResolver />} />
                </Routes>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm dark:text-gray-400">
                  <p>DNS/Email Security Testing Tool</p>
                  <p className="mt-1">
                    Comprehensive tools for testing and validating DNS records, SPF, and DMARC configurations
                  </p>
                </div>
              </div>
            </footer>

            {/* Floating Buttons */}
            <FloatingButtons />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App; 