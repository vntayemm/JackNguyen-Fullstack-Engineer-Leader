// Script to verify Login API connection
const axios = require('axios');

console.log('🔐 Verifying Login API Connection...');
console.log('====================================');

// Test configurations
const testConfigs = [
  {
    name: 'Development',
    baseURL: 'http://localhost:8080',
    endpoint: '/api/auth/login'
  },
  {
    name: 'Production',
    baseURL: 'https://domain-validator-service-533675451276.asia-southeast1.run.app',
    endpoint: '/api/auth/login'
  }
];

async function testConnection(config) {
  console.log(`\n📡 Testing ${config.name} connection...`);
  console.log(`   URL: ${config.baseURL}${config.endpoint}`);
  
  try {
    // Test health endpoint first
    const healthResponse = await axios.get(`${config.baseURL}/health`, {
      timeout: 5000
    });
    console.log(`   ✅ Health check: ${healthResponse.status} - ${healthResponse.data.status}`);
    
    // Test login endpoint (should return 400 for missing credentials, which is expected)
    try {
      const loginResponse = await axios.post(`${config.baseURL}${config.endpoint}`, {}, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`   ✅ Login endpoint: ${loginResponse.status}`);
    } catch (loginError) {
      if (loginError.response && loginError.response.status === 400) {
        console.log(`   ✅ Login endpoint: 400 (Expected - missing credentials)`);
      } else {
        console.log(`   ❌ Login endpoint error: ${loginError.message}`);
      }
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`   ❌ Connection refused - Server may not be running`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`   ❌ Host not found - Check URL`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`   ❌ Connection timeout`);
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

async function runTests() {
  for (const config of testConfigs) {
    await testConnection(config);
  }
  
  console.log('\n📝 Connection Test Summary:');
  console.log('  - Development: http://localhost:8080');
  console.log('  - Production: https://domain-validator-service-533675451276.asia-southeast1.run.app');
  console.log('  - Login endpoint: /api/auth/login');
  console.log('  - Expected behavior: 400 for missing credentials (valid endpoint)');
  console.log('\n✅ Login API connection verification complete!');
}

runTests().catch(console.error); 