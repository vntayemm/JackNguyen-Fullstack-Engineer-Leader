import sequelize from '../src/models/index.js';
import User from '../src/models/user.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful!');

    // Test creating a user to see if the table structure is correct
    console.log('\nTesting user creation...');
    try {
      const testUser = await User.create({
        username: 'testuser_' + Date.now(),
        email: 'test_' + Date.now() + '@example.com',
        password_hash: 'test_hash',
        is_verified: false
      });
      console.log('User created successfully:', testUser.id);
      
      // Clean up - delete the test user
      await testUser.destroy();
      console.log('Test user deleted successfully.');
      
    } catch (error) {
      console.error('Error creating test user:', error.message);
      console.error('Full error:', error);
    }

    // Check table structure
    console.log('\nChecking table structure...');
    try {
      const tableDescription = await sequelize.getQueryInterface().describeTable('Users');
      console.log('Table columns:', Object.keys(tableDescription));
    } catch (error) {
      console.error('Error describing table:', error.message);
    }

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

testDatabase(); 