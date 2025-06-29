# DNS/Email Security Tool - Developer Guide

## Introduction

### Frontend Structure
The frontend is built with **React 18** and **TypeScript**, providing a modern, responsive user interface for DNS and email security analysis.

**Key Technologies:**
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling and responsive design
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests with interceptors
- **React Context API** for state management
- **React Query** for server state management

**Project Structure:**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthInfoPanel.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── FloatingButtons.tsx
│   │   ├── Header.tsx
│   │   ├── RecordItemResult.tsx
│   │   └── UserDropdown.tsx
│   ├── config/             # Configuration files
│   │   └── index.ts        # API configuration and defaults
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── pages/              # Page components
│   │   ├── account/        # User account pages
│   │   ├── auth/           # Authentication pages
│   │   ├── legal/          # Legal pages
│   │   ├── Document.tsx    # Documentation page
│   │   └── DomainValidator.tsx # Main domain analysis page
│   ├── services/           # API service layer
│   │   └── api.ts          # Axios-based API client
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── public/                 # Static assets
├── scripts/                # Development and testing scripts
└── package.json            # Dependencies and scripts
```

### Frontend Setup for Development
The frontend uses **Create React App** with TypeScript template and includes several development tools:

**Available Scripts:**
- `npm start` - Start development server (port 3000)
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run build:prod` - Build with production API URL
- `npm run build:dev` - Build with development API URL
- `npm run test:api-url` - Test API connectivity
- `npm run test:login-api` - Test login API functionality
- `npm run verify:login-connection` - Verify login connection

**Environment Configuration:**
- Development: `REACT_APP_API_URL=http://localhost:8080`
- Production: `REACT_APP_API_URL=https://domain-validator-service-533675451276.asia-southeast1.run.app`

### Backend Structure
The backend is built with **Node.js** and **Express.js**, providing a robust API for DNS analysis and user management.

**Key Technologies:**
- **Express.js** with ES modules
- **PostgreSQL** with Sequelize ORM
- **JWT** for authentication
- **Nodemailer** for email services
- **Swagger/OpenAPI** for API documentation
- **Helmet** and **CORS** for security

**Project Structure:**
```
backend/
├── src/
│   ├── controllers/        # Request handlers and validation
│   │   ├── authController.js
│   │   ├── domainController.js
│   │   └── userController.js
│   ├── dto/               # Data Transfer Objects
│   │   ├── auth.dto.js
│   │   ├── domain.dto.js
│   │   ├── system.dto.js
│   │   ├── user.dto.js
│   │   └── index.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── errorHandler.js # Error handling
│   ├── models/            # Database models
│   │   └── index.js       # Sequelize models
│   ├── routes/            # API route definitions
│   │   ├── auth.js        # Authentication routes
│   │   ├── domain.js      # Domain management routes
│   │   └── user.js        # User management routes
│   ├── services/          # Business logic
│   │   ├── authService.js
│   │   ├── domainService.js
│   │   └── pythonDomainValidatorService.js
│   ├── utils/             # Utility functions
│   │   ├── hash.js        # Password hashing
│   │   ├── jwt.js         # JWT utilities
│   │   └── mailer.js      # Email utilities
│   ├── app.js             # Express application setup
│   └── config.js          # Configuration management
├── scripts/               # Database migration scripts
├── swagger.json           # API documentation
└── package.json           # Dependencies and scripts
```

### Database Schema
The application uses **PostgreSQL** with the following main tables:

**Users Table:**
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique, verified)
- `password_hash` (bcrypt hashed)
- `first_name`, `last_name`
- `is_verified` (Email verification status)
- `created_at`, `updated_at`

**Domains Table:**
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `domain_name` (Unique per user)
- `dns_provider`, `hosting_provider`
- `dns_record_published`, `dmarc_record_published`, `spf_record_published`
- `status`, `use_cases` (JSON)
- `created_at`, `updated_at`

**Relationships:**
- One-to-Many: User → Domains
- Each user can have multiple domains
- Domains are scoped to their owner

## Developer Guide

### Prerequisites
- **Node.js 18+** and npm/yarn
- **PostgreSQL 12+** database
- **Python 3.8+** (for DNS analysis scripts)
- **Git** for version control

### Initial Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd JackNguyen-Fullstack-Engineer-Leader
```

2. **Install dependencies:**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. **Environment Configuration:**
```bash
# Backend environment
cd backend
cp .env.development .env
# Edit .env with your database and email settings

# Frontend environment
cd ../frontend
cp env.development .env
# Edit .env with your API URL
```

### Database Setup

1. **Create PostgreSQL database:**
```sql
CREATE DATABASE dns_security_tool;
CREATE USER dns_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dns_security_tool TO dns_user;
```

**For Cloud Databases (like Render.com):**
- The database is already configured in the production environment
- SSL is automatically enabled for cloud connections
- No local database setup required for deployment

2. **Run database migrations:**
```bash
cd backend
npm run migrate
```

**Migration Options:**
- `npm run migrate` - Initialize fresh database schema (default)
- `npm run migrate -- --init` - Explicitly initialize fresh database
- `npm run migrate -- --migrate` - Run legacy migration for existing databases
- `npm run migrate -- --dry-run` - Preview what would be executed
- `npm run migrate -- --create-env` - Create .env template file

**Environment Variables for Database:**
```env
DB_HOST=dpg-d1g9stili9vc73ado8e0-a.singapore-postgres.render.com
DB_PORT=5432
DB_NAME=dns_email_security_tool_db_lujg
DB_USER=dns_email_security_tool_db_user
DB_PASSWORD=6srHbe0qg8NugLjb8ffQJsvteepi8FOA
```

### Starting the Application

**Start the Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:8080
# API docs available at http://localhost:8080/api/docs
```

**Start the Frontend:**
```bash
cd frontend
npm start
# Application starts on http://localhost:3000
```

**Verify Setup:**
```bash
# Test API connectivity
cd frontend
npm run test:api-url

# Test login functionality
npm run test:login-api
```

## Deployment Guide

### Docker and GitHub Actions Overview

The project uses **Docker** for containerization and **GitHub Actions** for continuous deployment to 
**Deployment Architecture:**
- **Frontend**: React app deployed to Cloud Run
- **Backend**: Node.js API deployed to Cloud Run
- **Database**: Cloud SQL PostgreSQL (production)
- **Container Registry**: Google Container Registry
- **CI/CD**: GitHub Actions workflows

### Configuration Required

#### Frontend Configuration
**Environment Variables:**
```env
REACT_APP_API_URL=https://domain-validator-service-533675451276.asia-southeast1.run.app
REACT_APP_ENVIRONMENT=production
```

**Docker Configuration:**
- Multi-stage build for optimization
- Nginx for serving static files
- Environment-specific builds

#### Backend Configuration
**Environment Variables:**
```env
NODE_ENV=production
PORT=8080

DB_HOST=dpg-d1g9stili9vc73ado8e0-a.singapore-postgres.render.com
DB_PORT=5432
DB_NAME=dns_email_security_tool_db_lujg
DB_USER=dns_email_security_tool_db_user
DB_PASSWORD=6srHbe0qg8NugLjb8ffQJsvteepi8FOA

EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=465
EMAIL_USER=services@globaldevhubs.com
EMAIL_PASS=BKg49t2uYhZf
EMAIL_FROM=Amberos-DNS/Email Security Tool <services@globaldevhubs.com>
```

**Docker Configuration:**
- Node.js runtime
- Health check endpoints
- Security headers with Helmet

#### GitHub Configuration
**Required Secrets:**
- `GCP_PROJECT_ID`: Google Cloud Project ID
- `GCP_SA_KEY`: Service Account JSON key
- `GCP_REGION`: Deployment region (e.g., asia-southeast1)

**Workflow Triggers:**
- Push to `main` branch
- Manual workflow dispatch
- Path-based triggers (commented out for full deployment)

### Deployment Process

1. **Commit to Main Branch:**
```bash
git add .
git commit -m "Your deployment message"
git push origin main
```

2. **Automatic Deployment:**
- GitHub Actions automatically triggers
- Builds Docker images for both frontend and backend
- Pushes to Google Container Registry
- Deploys to Cloud Run services

3. **Deployment URLs:**
- **Frontend**: https://domain-validator-reactjs-533675451276.asia-southeast1.run.app
- **Backend**: https://domain-validator-service-533675451276.asia-southeast1.run.app
- **API Docs**: https://domain-validator-service-533675451276.asia-southeast1.run.app/api/docs

## TEST ACCOUNT
Account: jack.nguyen
Password: Xr9$e2@LmVq#74Wd

## More About Features

### DNS Analysis Features

**Individual DNS Record Analysis:**
- **Endpoint**: `GET /api/domains/dns/records/{domain}/individual`
- **Supported Record Types**: A, AAAA, CNAME, MX, TXT, NS, PTR, SOA, SRV, CAA
- **Features**:
  - Real-time DNS resolution
  - Record validation and formatting
  - Error handling for DNS failures
  - Optional database storage (`no_save` parameter)
  - Comprehensive record analysis

**Domain Management:**
- **Add Domains**: `POST /api/domains`
- **List Domains**: `GET /api/domains`
- **Delete Domains**: `DELETE /api/domains/{domain}`
- **Features**:
  - User-scoped domain management
  - Domain validation and formatting
  - Duplicate prevention
  - Historical data tracking

**Analysis Capabilities:**
- **DNS Provider Detection**: Automatic detection of DNS providers (Cloudflare, GoDaddy, etc.)
- **Hosting Provider Detection**: Identifies hosting providers (AWS, DigitalOcean, etc.)
- **Record Publication Status**: Checks if DNS, SPF, and DMARC records are properly published
- **Use Case Analysis**: Comprehensive analysis of each DNS record type with goals, purposes, and expected outcomes

### User Authentication Features

**Registration System:**
- **Endpoint**: `POST /api/auth/register`
- **Features**:
  - Username and email validation
  - Password strength requirements
  - Email verification system
  - Duplicate account prevention
  - Secure password hashing with bcrypt

**Login System:**
- **Endpoint**: `POST /api/auth/login`
- **Features**:
  - JWT token-based authentication
  - Username/email login support
  - Secure password verification
  - Token expiration management
  - Session management

**Password Management:**
- **Forgot Password**: `POST /api/auth/forgot-password`
- **Reset Password**: `POST /api/auth/reset-password/{token}`
- **Change Password**: `PUT /api/user/change-password`
- **Features**:
  - Secure token-based password reset
  - Email-based password recovery
  - Current password verification
  - Password strength validation

**Email Verification:**
- **Endpoint**: `GET /api/auth/verify-email/{token}`
- **Features**:
  - Secure email verification tokens
  - Account activation workflow
  - Verification status tracking
  - Resend verification capability

**User Profile Management:**
- **Get Profile**: `GET /api/user/profile`
- **Update Profile**: `PUT /api/user/profile`
- **Delete Account**: `DELETE /api/user/delete-account`
- **Features**:
  - Profile information management
  - Account deletion with cleanup
  - Data privacy compliance
  - Secure profile updates

**Security Features:**
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Email Verification**: Required for account activation
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers
- **Rate Limiting**: API abuse prevention

### Frontend User Experience

**Responsive Design:**
- Mobile-first approach with Tailwind CSS
- Dark mode support
- Accessible UI components
- Cross-browser compatibility

**Real-time Features:**
- Live DNS analysis results
- Instant form validation
- Real-time error feedback
- Loading states and progress indicators

**User Interface:**
- Clean, modern design
- Intuitive navigation
- Comprehensive error handling
- Success notifications
- Loading animations

**Performance:**
- Optimized bundle size
- Lazy loading for routes
- Efficient API calls with React Query
- Caching strategies
- Image optimization

This comprehensive developer guide provides everything needed to understand, develop, and deploy the DNS/Email Security Tool project. 