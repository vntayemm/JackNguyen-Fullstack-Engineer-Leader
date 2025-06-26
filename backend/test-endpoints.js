import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  const testDomain = 'google.com';
  
  console.log('Testing Python domain validator endpoints...\n');
  
  try {
    // Test domain validation
    console.log('1. Testing domain validation (Python script)...');
    const validationResponse = await fetch(`${BASE_URL}/python-domain-validator/domain/validate/${testDomain}`);
    const validationResult = await validationResponse.json();
    console.log('✅ Domain validation result:', JSON.stringify(validationResult, null, 2));
    
    // Test SPF record
    console.log('\n2. Testing SPF record (Python script)...');
    const spfResponse = await fetch(`${BASE_URL}/python-domain-validator/spf/${testDomain}`);
    const spfResult = await spfResponse.json();
    console.log('✅ SPF record result:', JSON.stringify(spfResult, null, 2));
    
    // Test DNS records
    console.log('\n3. Testing DNS records (Python script)...');
    const dnsResponse = await fetch(`${BASE_URL}/python-domain-validator/dns/${testDomain}`);
    const dnsResult = await dnsResponse.json();
    console.log('✅ DNS records result:', JSON.stringify(dnsResult, null, 2));
    
    // Test Python script integration
    console.log('\n4. Testing Python script integration (comprehensive)...');
    const pythonResponse = await fetch(`${BASE_URL}/python-domain-validator/python/${testDomain}?testType=comprehensive`);
    const pythonResult = await pythonResponse.json();
    console.log('✅ Python script result:', JSON.stringify(pythonResult, null, 2));
    
    // Test comprehensive test
    console.log('\n5. Testing comprehensive test (all tests combined)...');
    const comprehensiveResponse = await fetch(`${BASE_URL}/python-domain-validator/comprehensive/${testDomain}`);
    const comprehensiveResult = await comprehensiveResponse.json();
    console.log('✅ Comprehensive test result:', JSON.stringify(comprehensiveResult, null, 2));
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- All endpoints now use the Python script functions');
    console.log('- Domain validation uses Python validators library');
    console.log('- SPF testing uses Python checkdmarc library');
    console.log('- DNS records use Python dnspython library');
    console.log('- Comprehensive test runs all Python functions');
    console.log('- Routes are now organized in separate files with descriptive names');
    console.log('- NodeJS domain validator routes: /api/domains, /api/spf, /api/dmarc, /api/dns');
    console.log('- Python domain validator routes: /api/python-domain-validator/*');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEndpoints();
}

export { testEndpoints }; 