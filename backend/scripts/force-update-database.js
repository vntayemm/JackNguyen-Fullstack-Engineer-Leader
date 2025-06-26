import sequelize from '../src/models/index.js';
import User from '../src/models/user.js';

async function forceUpdateDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Force sync with alter: true to add missing columns
    console.log('Forcing database sync with alter: true...');
    await sequelize.sync({ alter: true, force: false });
    console.log('Database sync completed.');

    // Verify the table structure
    console.log('\nVerifying table structure...');
    try {
      const tableDescription = await sequelize.getQueryInterface().describeTable('Users');
      console.log('Users table columns:', Object.keys(tableDescription));
      
      // Check if all required columns exist
      const requiredColumns = ['id', 'username', 'email', 'password_hash', 'is_verified', 'verification_token', 'reset_token', 'reset_token_expires', 'createdAt', 'updatedAt'];
      const existingColumns = Object.keys(tableDescription);
      
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
      if (missingColumns.length > 0) {
        console.log('Missing columns:', missingColumns);
      } else {
        console.log('All required columns are present!');
      }
    } catch (error) {
      console.error('Error describing table:', error.message);
    }

    console.log('Database force update completed successfully.');
  } catch (error) {
    console.error('Database force update failed:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the force update
forceUpdateDatabase(); 