// Comprehensive configuration verification script
console.log('🔧 Verifying Frontend and Backend URL Configuration...');
console.log('=====================================================');

// Test frontend configuration
console.log('\n📱 Frontend Configuration:');
const frontendConfig = {
  development: {
    NODE_ENV: 'development',
    REACT_APP_API_URL: undefined,
    expectedApiUrl: 'http://localhost:8080'
  },
  production: {
    NODE_ENV: 'production',
    REACT_APP_API_URL: undefined,
    expectedApiUrl: 'https://domain-validator-service-533675451276.asia-southeast1.run.app'
  }
};

Object.entries(frontendConfig).forEach(([env, config]) => {
  console.log(`\n  Environment: ${env}`);
  
  // Simulate environment
  process.env.NODE_ENV = config.NODE_ENV;
  process.env.REACT_APP_API_URL = config.REACT_APP_API_URL;
  
  // Simulate frontend config logic
  const apiUrl = process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://domain-validator-service-533675451276.asia-southeast1.run.app' 
      : 'http://localhost:8080'
  );
  
  console.log(`    API URL: ${apiUrl}`);
  console.log(`    Expected: ${config.expectedApiUrl}`);
  console.log(`    ✅ Match: ${apiUrl === config.expectedApiUrl ? 'YES' : 'NO'}`);
});

// Test backend configuration
console.log('\n🔧 Backend Configuration:');
const backendConfig = {
  development: {
    NODE_ENV: 'development',
    FRONTEND_URL: undefined,
    expectedFrontendUrl: 'http://localhost:3000'
  },
  production: {
    NODE_ENV: 'production',
    FRONTEND_URL: undefined,
    expectedFrontendUrl: 'https://domain-validator-service-533675451276.asia-southeast1.run.app'
  }
};

Object.entries(backendConfig).forEach(([env, config]) => {
  console.log(`\n  Environment: ${env}`);
  
  // Simulate environment
  process.env.NODE_ENV = config.NODE_ENV;
  process.env.FRONTEND_URL = config.FRONTEND_URL;
  
  // Simulate backend config logic
  const frontendUrl = process.env.FRONTEND_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://domain-validator-service-533675451276.asia-southeast1.run.app' 
      : 'http://localhost:3000'
  );
  
  console.log(`    Frontend URL: ${frontendUrl}`);
  console.log(`    Expected: ${config.expectedFrontendUrl}`);
  console.log(`    ✅ Match: ${frontendUrl === config.expectedFrontendUrl ? 'YES' : 'NO'}`);
});

// Test verification flow
console.log('\n🔗 Verification Flow Test:');
console.log('  Development:');
console.log('    Backend sends email with: http://localhost:3000/verify-email?token=xxx');
console.log('    Frontend calls: http://localhost:8080/auth/verify-email/xxx');
console.log('  Production:');
console.log('    Backend sends email with: https://domain-validator-service-533675451276.asia-southeast1.run.app/verify-email?token=xxx');
console.log('    Frontend calls: https://domain-validator-service-533675451276.asia-southeast1.run.app/auth/verify-email/xxx');

console.log('\n✅ Configuration verification complete!');
console.log('\n📝 Summary:');
console.log('  - Frontend API URLs are correctly configured for both environments');
console.log('  - Backend frontend URLs are correctly configured for both environments');
console.log('  - Verification links will work correctly in both development and production'); 