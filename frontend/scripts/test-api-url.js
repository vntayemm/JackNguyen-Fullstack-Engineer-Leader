// Test script to verify API URL configuration
console.log('Testing Frontend API URL Configuration...');
console.log('==========================================');

// Simulate different environments
const environments = ['development', 'production'];

environments.forEach(env => {
  console.log(`\nEnvironment: ${env}`);
  
  // Set environment variable
  process.env.NODE_ENV = env;
  process.env.REACT_APP_API_URL = undefined; // Reset to test fallback
  
  // Simulate the config logic
  const apiUrl = process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://domain-validator-service-533675451276.asia-southeast1.run.app' 
      : 'http://localhost:8080'
  );
  
  console.log(`API URL: ${apiUrl}`);
  
  // Test specific endpoints
  const endpoints = [
    '/auth/verify-email/test-token',
    '/auth/register',
    '/auth/login',
    '/auth/forgot-password',
    '/auth/reset-password/test-token'
  ];
  
  endpoints.forEach(endpoint => {
    console.log(`  ${endpoint} -> ${apiUrl}${endpoint}`);
  });
});

console.log('\nExpected URLs:');
console.log('- Development: http://localhost:8080');
console.log('- Production: https://domain-validator-service-533675451276.asia-southeast1.run.app');

console.log('\nAPI URL Configuration Test Complete!'); 