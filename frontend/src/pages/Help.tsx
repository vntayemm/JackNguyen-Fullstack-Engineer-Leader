import React from 'react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Help & Documentation
          </h1>
          <Link
            to="/profile"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Profile
          </Link>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This DNS/Email Security Tool helps you analyze and validate domain configurations, 
              including SPF, DMARC, and DNS records. It provides comprehensive security insights 
              for your email infrastructure.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  🌐 Domain Validator
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Validate domain names and check their format. Ensures domains follow proper naming conventions.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  📧 SPF Analyzer
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyze SPF (Sender Policy Framework) records to prevent email spoofing and improve deliverability.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  🛡️ DMARC Analyzer
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check DMARC (Domain-based Message Authentication) policies for email authentication and reporting.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  🔍 DNS Resolver
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Query various DNS record types (A, AAAA, MX, TXT, CNAME, NS, SOA) for domain analysis.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Use
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your dashboard to manage saved domains, run tests, and view results. 
                  Add new domains and track their security status over time.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Individual Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use the quick access tools to analyze specific aspects of domains. 
                  Each tool provides detailed results and recommendations.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Test Results
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View comprehensive test results with status indicators (PASS/FAIL/ERROR) 
                  and detailed information about each security check.
                </p>
              </div>
            </div>
          </section>

          {/* Understanding Results */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Understanding Test Results
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                  <span className="mr-1">✅</span>
                  PASS
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  The test passed successfully. Your configuration is correct.
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                  <span className="mr-1">❌</span>
                  FAIL
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  The test failed. Review the details and fix the configuration.
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300">
                  <span className="mr-1">⚠️</span>
                  ERROR
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  An error occurred during testing. Check the domain or try again later.
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                  <span className="mr-1">⏳</span>
                  NOT TESTED
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  The test hasn't been run yet. Click "Test" to run the analysis.
                </span>
              </div>
            </div>
          </section>

          {/* Security Best Practices */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Security Best Practices
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  SPF Records
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                  <li>• Always include all authorized mail servers</li>
                  <li>• Use "-all" for strict enforcement</li>
                  <li>• Keep records under 255 characters</li>
                  <li>• Avoid more than 10 DNS lookups</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                  DMARC Policies
                </h3>
                <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm">
                  <li>• Start with "none" policy for monitoring</li>
                  <li>• Gradually move to "quarantine" then "reject"</li>
                  <li>• Set up reporting for insights</li>
                  <li>• Use 100% percentage for full enforcement</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                  DNS Security
                </h3>
                <ul className="text-purple-800 dark:text-purple-200 space-y-1 text-sm">
                  <li>• Use DNSSEC for DNS security</li>
                  <li>• Monitor DNS records regularly</li>
                  <li>• Keep TTL values reasonable</li>
                  <li>• Use multiple DNS providers for redundancy</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Troubleshooting
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Common Issues
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Test fails:</strong> Check if the domain is accessible and DNS is properly configured.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>SPF errors:</strong> Verify SPF record syntax and ensure it's published in DNS.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>DMARC not found:</strong> Create a DMARC record at _dmarc.yourdomain.com.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>DNS timeout:</strong> Check DNS server configuration and network connectivity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you need additional help or encounter issues, please check the troubleshooting section above. 
              For technical support, contact your system administrator or refer to the DNS/Email security documentation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help; 