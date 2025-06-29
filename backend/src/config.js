import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 8080,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://domain-validator-reactjs-533675451276.asia-southeast1.run.app',
  
  // Frontend URL Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://domain-validator-reactjs-533675451276.asia-southeast1.run.app',
  
  // Security
  HELMET_ENABLED: process.env.HELMET_ENABLED === 'true',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  
  // Database Configuration Details
  DATABASE: {
    host: process.env.DB_HOST || 'dpg-d1g9stili9vc73ado8e0-a.singapore-postgres.render.com',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'dns_email_security_tool_db_lujg',
    username: process.env.DB_USER || 'dns_email_security_tool_db_user',
    password: process.env.DB_PASSWORD || '6srHbe0qg8NugLjb8ffQJsvteepi8FOA'
  },
  
  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'services@globaldevhubs.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'BKg49t2uYhZf',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Amberos-DNS/Email Security Tool <services@globaldevhubs.com>',
  

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