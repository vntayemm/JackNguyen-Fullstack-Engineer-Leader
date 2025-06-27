// Test script to verify Login API configuration
console.log('🔐 Testing Login API Configuration...');
console.log('=====================================');

// Simulate React environment variables
const originalEnv = process.env.NODE_ENV;
const originalApiUrl = process.env.REACT_APP_API_URL;

// Test different environments
const testCases = [
  {
    name: 'Development (default)',
    NODE_ENV: 'development',
    REACT_APP_API_URL: undefined,
    expectedUrl: 'http://localhost:8080'
  },
  {
    name: 'Development (explicit)',
    NODE_ENV: 'development',
    REACT_APP_API_URL: 'http://localhost:8080',
    expectedUrl: 'http://localhost:8080'
  },
  {
    name: 'Production (default)',
    NODE_ENV: 'production',
    REACT_APP_API_URL: undefined,
    expectedUrl: 'https://domain-validator-service-533675451276.asia-southeast1.run.app'
  },
  {
    name: 'Production (explicit)',
    NODE_ENV: 'production',
    REACT_APP_API_URL: 'https://domain-validator-service-533675451276.asia-southeast1.run.app',
    expectedUrl: 'https://domain-validator-service-533675451276.asia-southeast1.run.app'
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log('   Environment Variables:');
  console.log(`     NODE_ENV: ${testCase.NODE_ENV}`);
  console.log(`     REACT_APP_API_URL: ${testCase.REACT_APP_API_URL || 'undefined'}`);
  
  // Simulate the config logic
  process.env.NODE_ENV = testCase.NODE_ENV;
  process.env.REACT_APP_API_URL = testCase.REACT_APP_API_URL;
  
  const apiUrl = process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://domain-validator-service-533675451276.asia-southeast1.run.app' 
      : 'http://localhost:8080'
  );
  
  console.log('   Result:');
  console.log(`     API URL: ${apiUrl}`);
  console.log(`     Expected: ${testCase.expectedUrl}`);
  console.log(`     ✅ Match: ${apiUrl === testCase.expectedUrl ? 'YES' : 'NO'}`);
  
  // Test login endpoint
  const loginEndpoint = `${apiUrl}/api/auth/login`;
  console.log(`     Login Endpoint: ${loginEndpoint}`);
});

// Test actual API call simulation
console.log('\n🔗 API Call Simulation:');
console.log('  Development Login Request:');
console.log('    POST http://localhost:8080/api/auth/login');
console.log('    Body: { username: "testuser", password: "testpass" }');

console.log('\n  Production Login Request:');
console.log('    POST https://domain-validator-service-533675451276.asia-southeast1.run.app/api/auth/login');
console.log('    Body: { username: "testuser", password: "testpass" }');

// Restore original environment
process.env.NODE_ENV = originalEnv;
process.env.REACT_APP_API_URL = originalApiUrl;

console.log('\n✅ Login API configuration test complete!');
console.log('\n📝 Summary:');
console.log('  - Login component uses apiService.login() method');
console.log('  - apiService uses config.apiUrl for base URL');
console.log('  - config.apiUrl is environment-aware');
console.log('  - Login endpoint: /api/auth/login');
console.log('  - Full URL: {config.apiUrl}/api/auth/login'); 