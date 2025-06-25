import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Security
  HELMET_ENABLED: process.env.HELMET_ENABLED === 'true',
  
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