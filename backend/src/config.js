import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Frontend URL Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // CORS Origins for different environments
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
  
  // Security
  HELMET_ENABLED: process.env.HELMET_ENABLED === 'true',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database',
  
  // Database Configuration Details
  DATABASE: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'domain_validator_db',
    username: process.env.DB_USER || 'username',
    password: process.env.DB_PASSWORD || 'password'
  },
  
  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '459a0c001@smtp-brevo.com',
  EMAIL_PASS: process.env.EMAIL_PASS || '7qa84DCrOzITKtG5',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Amberos Pte. Ltd <459a0c001@smtp-brevo.com>',
  

  // DNS Configuration
  DNS_TIMEOUT: parseInt(process.env.DNS_TIMEOUT) || 10000,
  DNS_RETRIES: parseInt(process.env.DNS_RETRIES) || 3,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // API Configuration
  API_PREFIX: '/api',
  API_VERSION: 'v1',
};

export default config; 