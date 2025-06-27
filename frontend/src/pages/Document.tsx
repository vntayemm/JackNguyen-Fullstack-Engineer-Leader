import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

const Document: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Technical Documentation & Help
          </h1>
          <Link
            to="/profile"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Profile
          </Link>
        </div>

        <div className="space-y-8">
          {/* Requirements Implementation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 Full-Stack Engineer Test Requirements Implementation
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
                  ✅ Core Requirements - COMPLETED
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">Domain Validation</h4>
                    <ul className="text-green-700 dark:text-green-300 space-y-2 text-sm">
                      <li>• Real-time domain format validation using validators library</li>
                      <li>• Support for various domain formats (example.com, www.example.com)</li>
                      <li>• DNS record resolution with dnspython</li>
                      <li>• Error handling for invalid domains</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">SPF Record Analysis</h4>
                    <ul className="text-green-700 dark:text-green-300 space-y-2 text-sm">
                      <li>• Parse SPF records using checkdmarc library</li>
                      <li>• Identify syntax errors and warnings</li>
                      <li>• Support for complex SPF mechanisms (include, ip4, ip6, etc.)</li>
                      <li>• Default SPF: v=spf1 include:zoho.com ~all</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">DMARC Record Analysis</h4>
                    <ul className="text-green-700 dark:text-green-300 space-y-2 text-sm">
                      <li>• Parse DMARC policies using checkdmarc library</li>
                      <li>• Validate DMARC record syntax and structure</li>
                      <li>• Policy recommendations and best practices</li>
                      <li>• Default DMARC: v=DMARC1; p=quarantine; rua=mailto:minh.nguyen@globaldevhubs.com</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">DNS Resolution</h4>
                    <ul className="text-green-700 dark:text-green-300 space-y-2 text-sm">
                      <li>• Resolve multiple DNS record types (A, AAAA, MX, TXT, CNAME)</li>
                      <li>• Display formatted DNS results</li>
                      <li>• Error handling for DNS failures</li>
                      <li>• Timeout and retry mechanisms</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  🔐 Authentication System - COMPLETED
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">User Registration & Login</h4>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                      <li>• Secure user registration with email verification</li>
                      <li>• JWT-based authentication system</li>
                      <li>• Password hashing with bcrypt</li>
                      <li>• Session management and token refresh</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Password Management</h4>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                      <li>• Forgot password functionality</li>
                      <li>• Secure password reset with email tokens</li>
                      <li>• Password change in user profile</li>
                      <li>• Account deletion capability</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
                  🗄️ Domain Management - COMPLETED
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Domain Testing & Storage</h4>
                    <ul className="text-purple-700 dark:text-purple-300 space-y-2 text-sm">
                      <li>• Save tested domains to user account</li>
                      <li>• View test history and results</li>
                      <li>• Re-run tests on saved domains</li>
                      <li>• Bulk domain testing capabilities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Database Integration</h4>
                    <ul className="text-purple-700 dark:text-purple-300 space-y-2 text-sm">
                      <li>• PostgreSQL database with Sequelize ORM</li>
                      <li>• User and domain relationship models</li>
                      <li>• Test result persistence</li>
                      <li>• Data validation and constraints</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tool Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🏗️ Tool Architecture Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Frontend (React/TypeScript)
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• React Router for navigation</li>
                  <li>• Context API for state management</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                  Backend (Node.js/Express)
                </h3>
                <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm">
                  <li>• Express.js REST API</li>
                  <li>• Sequelize ORM with PostgreSQL</li>
                  <li>• JWT authentication</li>
                  <li>• Nodemailer for email services</li>
                  <li>• Swagger API documentation</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Python Script
                </h3>
                <ul className="text-purple-800 dark:text-purple-200 space-y-1 text-sm">
                  <li>• Domain validation & testing</li>
                  <li>• SPF/DMARC analysis</li>
                  <li>• DNS record resolution</li>
                  <li>• JSON output format</li>
                  <li>• CLI argument support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Frontend Details */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🎨 Frontend Technical Details
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Technology Stack
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Core Dependencies:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• React 18.2.0</li>
                      <li>• TypeScript 4.7.4</li>
                      <li>• React Router DOM 6.3.0</li>
                      <li>• Axios 1.6.0</li>
                      <li>• React Query 3.39.3</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Styling & Build:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Tailwind CSS 3.3.0</li>
                      <li>• PostCSS & Autoprefixer</li>
                      <li>• React Scripts 5.0.1</li>
                      <li>• Web Vitals</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Key Features
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>Authentication System:</strong> Login, registration, password reset with email verification</li>
                  <li>• <strong>Dashboard:</strong> Domain management with CRUD operations</li>
                  <li>• <strong>Domain Testing:</strong> Real-time SPF, DMARC, and DNS analysis</li>
                  <li>• <strong>User Profile:</strong> Account settings and management</li>
                  <li>• <strong>Responsive Design:</strong> Mobile-first approach with dark mode support</li>
                  <li>• <strong>Error Handling:</strong> Comprehensive error states and user feedback</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Backend Details */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ⚙️ Backend Technical Details
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Technology Stack
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Core Dependencies:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Express.js 4.18.2</li>
                      <li>• Sequelize 6.37.7 (ORM)</li>
                      <li>• PostgreSQL (Database)</li>
                      <li>• JWT 9.0.2 (Authentication)</li>
                      <li>• Bcrypt 6.0.0 (Password hashing)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Additional Services:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Nodemailer 7.0.3 (Email)</li>
                      <li>• Helmet 7.0.0 (Security)</li>
                      <li>• CORS 2.8.5 (Cross-origin)</li>
                      <li>• Swagger UI Express (API docs)</li>
                      <li>• Validator 13.9.0 (Input validation)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  API Endpoints
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Authentication:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• POST /auth/register</li>
                      <li>• POST /auth/login</li>
                      <li>• POST /auth/forgot-password</li>
                      <li>• POST /auth/reset-password</li>
                      <li>• POST /auth/verify-email</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Domain Testing:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• POST /domains/test</li>
                      <li>• POST /domains/spf/analyze</li>
                      <li>• POST /domains/dmarc/analyze</li>
                      <li>• GET /domains/dns/resolve</li>
                      <li>• GET /domains (user's domains)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Python Script Details */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🐍 Python Script Details
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Dependencies & Features
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Core Libraries:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• dnspython 2.7.0 (DNS resolution)</li>
                      <li>• validators 0.35.0 (Domain validation)</li>
                      <li>• checkdmarc 4.8.0 (SPF/DMARC analysis)</li>
                      <li>• pytest 8.4.1 (Testing framework)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Testing Features:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Domain format validation tests</li>
                      <li>• SPF record parsing tests</li>
                      <li>• DNS resolution tests</li>
                      <li>• Error handling tests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Development Guidelines */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              💻 Development Guidelines
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Code Quality Standards
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>TypeScript:</strong> Strict type checking enabled</li>
                  <li>• <strong>ESLint:</strong> Code linting and formatting</li>
                  <li>• <strong>Prettier:</strong> Consistent code formatting</li>
                  <li>• <strong>Error Handling:</strong> Comprehensive try-catch blocks</li>
                  <li>• <strong>Validation:</strong> Input validation on all endpoints</li>
                  <li>• <strong>Security:</strong> SQL injection prevention, XSS protection</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Testing Strategy
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>Unit Tests:</strong> Python script testing with pytest</li>
                  <li>• <strong>Integration Tests:</strong> API endpoint testing</li>
                  <li>• <strong>Frontend Tests:</strong> Component testing with React Testing Library</li>
                  <li>• <strong>E2E Tests:</strong> User workflow testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Production Deployment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🚀 Production Deployment
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Deployment Options
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Docker Deployment:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Multi-stage Docker builds</li>
                      <li>• Docker Compose for local development</li>
                      <li>• Production-ready containerization</li>
                      <li>• Environment variable management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Cloud Deployment:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Google Cloud Run (recommended)</li>
                      <li>• AWS Elastic Beanstalk</li>
                      <li>• Heroku deployment</li>
                      <li>• Vercel for frontend</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  CI/CD Pipeline
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>GitHub Actions:</strong> Automated testing and deployment</li>
                  <li>• <strong>Code Quality:</strong> Automated linting and type checking</li>
                  <li>• <strong>Security Scanning:</strong> Dependency vulnerability checks</li>
                  <li>• <strong>Deployment:</strong> Automated deployment to staging/production</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Monitoring & Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Monitoring & Troubleshooting
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Monitoring Tools
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>Application Monitoring:</strong> New Relic, DataDog</li>
                  <li>• <strong>Error Tracking:</strong> Sentry for error monitoring</li>
                  <li>• <strong>Logging:</strong> Structured logging with Winston</li>
                  <li>• <strong>Health Checks:</strong> API health endpoint monitoring</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Common Issues & Solutions
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>Database Connection:</strong> Check DATABASE_URL and SSL settings</li>
                  <li>• <strong>Email Service:</strong> Verify SMTP credentials and settings</li>
                  <li>• <strong>CORS Issues:</strong> Ensure proper CORS configuration</li>
                  <li>• <strong>JWT Tokens:</strong> Check JWT_SECRET and token expiration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Support & Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🆘 Support & Contact
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Technical Support
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                    <li>• <strong>Email:</strong> <a href="mailto:enquiries@amberos.com" className="text-blue-600 dark:text-blue-400 hover:underline">enquiries@amberos.com</a></li>
                    <li>• <strong>Website:</strong> <a href="https://amberos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://amberos.com</a></li>
                    <li>• <strong>API Documentation:</strong> <a href={`${config.apiUrl}/api/docs`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">API Document</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Development Team
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                    <li>• <strong>Company:</strong> Amberos Pte. Ltd</li>
                    <li>• <strong>Experience:</strong> 10+ years in IT solutions</li>
                    <li>• <strong>Specialization:</strong> Full-stack development</li>
                    <li>• <strong>Location:</strong> Singapore & Vietnam</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Document; 