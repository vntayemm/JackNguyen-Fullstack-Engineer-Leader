import axios from 'axios';

const API_URL = 'http://localhost:8080';

async function testProfileEndpoint() {
  try {
    console.log('Testing profile endpoint...');
    
    // First, try to login to get a token
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.token;
    
    // Now test the profile endpoint
    const profileResponse = await axios.get(`${API_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile response:', profileResponse.data);
    
  } catch (error) {
    console.error('Error testing profile endpoint:', error.response?.data || error.message);
  }
}

testProfileEndpoint(); 