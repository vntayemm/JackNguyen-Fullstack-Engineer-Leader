const config = {
  apiUrl: process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://domain-validator-service-533675451276.asia-southeast1.run.app' 
      : 'http://localhost:8080'
  ),
  apiTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

export default config; 