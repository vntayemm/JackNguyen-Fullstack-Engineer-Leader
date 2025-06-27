const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://domain-validator-service-533675451276.asia-southeast1.run.app' 
      : 'http://localhost:8080'
  ),
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'), // 10 seconds default
  
  // Environment
  environment: process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development',
  
  // Feature Flags
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDebugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  
  // Retry Configuration
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // Version
  version: process.env.REACT_APP_VERSION || '1.0.0',
};

export default config; 