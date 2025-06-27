import React from 'react';
import { Link } from 'react-router-dom';

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
                      <li>• POST /domain-validator/test</li>
                      <li>• POST /nodejs-domain-validator/test</li>
                      <li>• POST /python-domain-validator/test</li>
                      <li>• GET /domain-validator/domains</li>
                      <li>• POST /domain-validator/domains</li>
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
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Key Functions:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Domain format validation</li>
                      <li>• SPF record parsing & validation</li>
                      <li>• DMARC record analysis</li>
                      <li>• DNS record resolution (A, AAAA, MX, TXT)</li>
                      <li>• Comprehensive test suite</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Usage Examples
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded text-sm font-mono">
                  <div># Test a single domain</div>
                  <div>python scripts/test-domain.py --domain example.com</div>
                  <br/>
                  <div># Run comprehensive tests</div>
                  <div>python scripts/test-domain.py --comprehensive example.com</div>
                  <br/>
                  <div># Test with JSON output</div>
                  <div>python scripts/test-domain.py --json --domain example.com</div>
                </div>
              </div>
            </div>
          </section>

          {/* Development Guidelines */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🛠️ Development Guidelines
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Local Development Setup
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Backend Setup:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                      <div>cd backend</div>
                      <div>npm install</div>
                      <div>npm run dev</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Frontend Setup:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                      <div>cd frontend</div>
                      <div>npm install</div>
                      <div>npm start</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Database Setup:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                      <div># Configure PostgreSQL connection</div>
                      <div># Update src/config.js with your DB credentials</div>
                      <div>npm run db:update</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                  Code Standards
                </h3>
                <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm">
                  <li>• <strong>Backend:</strong> Use ES6 modules, async/await, proper error handling</li>
                  <li>• <strong>Frontend:</strong> TypeScript strict mode, functional components with hooks</li>
                  <li>• <strong>Python:</strong> PEP 8 style, type hints, comprehensive docstrings</li>
                  <li>• <strong>Database:</strong> Use Sequelize migrations, proper indexing</li>
                  <li>• <strong>API:</strong> RESTful design, consistent error responses</li>
                  <li>• <strong>Security:</strong> Input validation, SQL injection prevention, XSS protection</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Testing Strategy
                </h3>
                <ul className="text-purple-800 dark:text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Backend:</strong> Jest for unit tests, endpoint testing with test-endpoints.js</li>
                  <li>• <strong>Frontend:</strong> React Testing Library, component testing</li>
                  <li>• <strong>Python:</strong> Pytest for script testing, comprehensive test cases</li>
                  <li>• <strong>Integration:</strong> API endpoint testing, database integration tests</li>
                  <li>• <strong>E2E:</strong> Manual testing of complete user workflows</li>
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
                  Docker Configuration
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Backend Dockerfile:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Python 3.11-slim base image</li>
                      <li>• Node.js 20.x installation</li>
                      <li>• Multi-stage build for optimization</li>
                      <li>• Non-root user for security</li>
                      <li>• Port 8080 exposure</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Frontend Dockerfile:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Node.js 20-alpine build stage</li>
                      <li>• Nginx alpine production stage</li>
                      <li>• Static file serving</li>
                      <li>• Custom nginx configuration</li>
                      <li>• Port 8080 exposure</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Google Cloud Run Deployment
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Deployment Commands:</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono">
                      <div># Build and push image</div>
                      <div>docker build -t gcr.io/PROJECT_ID/dns-email-security-backend .</div>
                      <div>docker push gcr.io/PROJECT_ID/dns-email-security-backend</div>
                      <br/>
                      <div># Deploy to Cloud Run</div>
                      <div>gcloud run deploy dns-email-security-backend \</div>
                      <div>  --image gcr.io/PROJECT_ID/dns-email-security-backend \</div>
                      <div>  --platform managed --region asia-southeast1 \</div>
                      <div>  --allow-unauthenticated --port 8080</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Configuration:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Memory: 1Gi, CPU: 1 vCPU</li>
                      <li>• Max instances: 10, Timeout: 300s</li>
                      <li>• Environment variables for production settings</li>
                      <li>• CORS configuration for frontend access</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Environment Variables
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Backend (Production):</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• NODE_ENV=production</li>
                      <li>• PORT=8080</li>
                      <li>• CORS_ORIGIN=https://frontend-url</li>
                      <li>• FRONTEND_URL=https://frontend-url</li>
                      <li>• HELMET_ENABLED=true</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Frontend (Production):</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• REACT_APP_API_URL=https://backend-url</li>
                      <li>• REACT_APP_ENVIRONMENT=production</li>
                      <li>• Build-time environment configuration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Monitoring & Maintenance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Monitoring & Maintenance
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Health Checks & Monitoring
                </h3>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-1 text-sm">
                  <li>• <strong>Health Endpoint:</strong> GET /health for service status</li>
                  <li>• <strong>Cloud Run Console:</strong> Monitor requests, errors, performance</li>
                  <li>• <strong>Cloud Logging:</strong> Application logs and error tracking</li>
                  <li>• <strong>Cloud Monitoring:</strong> Set up alerts for errors and performance</li>
                  <li>• <strong>Database Monitoring:</strong> Connection pool and query performance</li>
                </ul>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                  Security Considerations
                </h3>
                <ul className="text-red-800 dark:text-red-200 space-y-1 text-sm">
                  <li>• <strong>Authentication:</strong> JWT tokens with proper expiration</li>
                  <li>• <strong>Authorization:</strong> Role-based access control</li>
                  <li>• <strong>Input Validation:</strong> Sanitize all user inputs</li>
                  <li>• <strong>HTTPS:</strong> Enforce secure connections</li>
                  <li>• <strong>Rate Limiting:</strong> Prevent abuse and DDoS</li>
                  <li>• <strong>Database Security:</strong> Connection encryption, prepared statements</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Backup & Recovery
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                  <li>• <strong>Database Backups:</strong> Automated PostgreSQL backups</li>
                  <li>• <strong>Code Versioning:</strong> Git repository with proper branching</li>
                  <li>• <strong>Configuration Management:</strong> Environment-specific configs</li>
                  <li>• <strong>Disaster Recovery:</strong> Multi-region deployment strategy</li>
                  <li>• <strong>Rollback Procedures:</strong> Quick deployment rollback capability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🔧 Troubleshooting Guide
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Common Issues & Solutions
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Backend Issues:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• <strong>Database Connection:</strong> Check PostgreSQL credentials and SSL settings</li>
                      <li>• <strong>Python Script Errors:</strong> Verify dependencies in requirements.txt</li>
                      <li>• <strong>CORS Errors:</strong> Update CORS_ORIGIN environment variable</li>
                      <li>• <strong>Memory Issues:</strong> Increase Cloud Run memory allocation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Frontend Issues:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• <strong>API Connection:</strong> Verify REACT_APP_API_URL configuration</li>
                      <li>• <strong>Build Errors:</strong> Check TypeScript compilation and dependencies</li>
                      <li>• <strong>Authentication:</strong> Clear localStorage and re-login</li>
                      <li>• <strong>Styling Issues:</strong> Verify Tailwind CSS compilation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Deployment Issues:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• <strong>Docker Build Failures:</strong> Check Dockerfile syntax and dependencies</li>
                      <li>• <strong>Cloud Run Timeouts:</strong> Increase timeout and memory settings</li>
                      <li>• <strong>Environment Variables:</strong> Verify all required env vars are set</li>
                      <li>• <strong>SSL/TLS Issues:</strong> Check certificate configuration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support & Resources */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📚 Support & Resources
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Documentation & References
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• <strong>API Documentation:</strong> Swagger UI at /api-docs endpoint</li>
                  <li>• <strong>Database Schema:</strong> Sequelize models in src/models/</li>
                  <li>• <strong>Python Script:</strong> Detailed comments in scripts/test-domain.py</li>
                  <li>• <strong>Cloud Run Guide:</strong> CLOUD_RUN_DEPLOYMENT.md</li>
                  <li>• <strong>Testing Guide:</strong> TEST_DOMAIN_ENDPOINTS.md</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Development Commands
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Backend Commands:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• npm run dev (Development server)</li>
                      <li>• npm run test (Run tests)</li>
                      <li>• npm run swagger:generate (Update API docs)</li>
                      <li>• npm run db:update (Database migrations)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Frontend Commands:</h4>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• npm start (Development server)</li>
                      <li>• npm run build (Production build)</li>
                      <li>• npm test (Run tests)</li>
                      <li>• npm run build:prod (Production build with API URL)</li>
                    </ul>
                  </div>
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