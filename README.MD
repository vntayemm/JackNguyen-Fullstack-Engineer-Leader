# DNS/Email Security Tool

A comprehensive full-stack application for testing and validating DNS records, SPF, and DMARC configurations with user authentication and domain management capabilities.

## 👥 Production Info
**Developed by**: Jack Nguyen
- **Contact**: [phuminh88@gmail.com](phuminh88@gmail.com)
- **API Documentation For Demo**: [API Document](https://domain-validator-service-533675451276.asia-southeast1.run.app/api/docs)
- **Website For Demo**: [DNS/Email Security Tool](https://domain-validator-reactjs-533675451276.asia-southeast1.run.app/)


## 🚀 Project Overview

This tool provides a complete solution for:
- **Domain Validation**: Test domain names and validate their format
- **SPF Analysis**: Parse and validate SPF records for email authentication
- **DMARC Analysis**: Analyze DMARC policies and configurations
- **DNS Resolution**: Resolve and display DNS records
- **User Management**: Secure authentication with email verification
- **Domain Management**: Save and manage tested domains

## 🏗️ Architecture

#### Project Structure

```
├── backend/                # FastAPI backend
│   ├── scripts/            # This is auto generate the swagger. The slug is /api/docs
│   ├── src/
│   │   ├── controller/     # Validate the input, process the in/out put
│   │   ├── routes/         # Collect all of routed
│   │   ├── services/       # Business logic
├── frontend/               # React frontend
│   ├── scripts/            # Help developer to validate the environment
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Collect important of config into index.ts and set default if empty
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   ├── public/             # Static assets
```

### Frontend (React/TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with responsive design
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios with React Query
- **Build Tool**: Create React App

### Backend (Node.js/Express)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Email Service**: Nodemailer for verification emails
- **API Documentation**: Swagger/OpenAPI with TSOA
- **Security**: Helmet, CORS, input validation

### Python Script
- **DNS Resolution**: dnspython for DNS queries
- **Domain Validation**: validators library
- **SPF/DMARC Analysis**: checkdmarc library
- **Testing**: pytest framework
- **Output**: JSON format for API integration

## 📋 Requirements Implementation

### Core Features ✅

1. **Domain Validation**
   - Real-time domain format validation
   - DNS record resolution
   - Support for various domain formats

2. **SPF Record Analysis**
   - Parse SPF records with detailed validation
   - Identify syntax errors and warnings
   - Support for complex SPF mechanisms
   - Default SPF record: `v=spf1 include:zoho.com ~all`

3. **DMARC Record Analysis**
   - Parse DMARC policies and configurations
   - Validate DMARC record syntax
   - Identify policy issues and recommendations
   - Default DMARC record: `v=DMARC1; p=quarantine; rua=mailto:minh.nguyen@globaldevhubs.com`

4. **DNS Resolution**
   - Resolve various DNS record types (A, AAAA, MX, TXT, etc.)
   - Display formatted DNS results
   - Error handling for DNS failures

### User Authentication System ✅

1. **Registration & Login**
   - User registration with email verification
   - Secure login with JWT tokens
   - Password reset functionality
   - Email verification system

2. **User Profile Management**
   - Profile information updates
   - Password change functionality
   - Account deletion

3. **Security Features**
   - Password hashing with bcrypt
   - JWT token authentication
   - Email verification for new accounts
   - Secure password reset flow

### Domain Management ✅

1. **Domain Testing**
   - Save tested domains to user account
   - View test history and results
   - Re-run tests on saved domains

2. **Test Results Storage**
   - Persistent storage of test results
   - Historical data tracking
   - Result comparison and analysis

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+ and pip
- PostgreSQL database
- SMTP server for email functionality

### Backend Setup
```bash
cd backend
npm install
cp .env.development .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.development .env
# Configure environment variables
npm start
```

### Python Dependencies
```bash
pip install dnspython validators checkdmarc pytest
```

## 🔧 Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://username:password@localhost:5432/database
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
EMAIL_FROM=Amberos Pte. Ltd <your-email@domain.com>
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development
```

## 🚀 Deployment

### Docker Deployment
- [x] Frontend and Backend with Dockerfile and Deploy into Cloud Run with the Cloud Run (Google Cloud)

## 📊 Features Summary

### ✅ Implemented Features
- [x] Domain validation with real-time feedback
- [x] SPF record parsing and analysis
- [x] DMARC record parsing and analysis
- [x] DNS record resolution
- [x] User authentication system
- [x] Email verification
- [x] Password reset functionality
- [x] Domain management (CRUD operations)
- [x] Responsive web interface
- [x] Dark mode support
- [x] API documentation with Swagger
- [x] Error handling and validation
- [x] Security best practices
- [x] Database integration
- [x] Email service integration

### 🎯 Technical Achievements
- **Full-Stack TypeScript**: Both frontend and backend use TypeScript
- **Modern React Patterns**: Hooks, Context API, React Query
- **Secure Authentication**: JWT, bcrypt, email verification
- **Database Design**: Proper relationships and constraints
- **API Design**: RESTful endpoints with proper error handling
- **Documentation**: Comprehensive API documentation
- **Deployment Ready**: Docker configuration and environment setup

## 👥 Team & Contact

**Developed by**: Jack Nguyen
- **Contact**: [phuminh88@gmail.com](phuminh88@gmail.com)
- **API Documentation For Demo**: [API Document](https://domain-validator-service-533675451276.asia-southeast1.run.app/api/docs)
- **Website For Demo**: [DNS/Email Security Tool](https://domain-validator-reactjs-533675451276.asia-southeast1.run.app/)


**Version**: 1.0.0  
**Last Updated**: June 27, 2025
