const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  apiTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

export default config; 