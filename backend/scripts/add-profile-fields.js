import sequelize from '../src/models/index.js';

async function addProfileFields() {
  try {
    console.log('Adding first_name and last_name columns to users table...');
    
    // Add first_name column
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "first_name" VARCHAR(255)
    `);
    
    // Add last_name column
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "last_name" VARCHAR(255)
    `);
    
    console.log('✅ Successfully added first_name and last_name columns to users table');
    
    // Verify the columns exist
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Users' 
      AND column_name IN ('first_name', 'last_name')
    `);
    
    console.log('Verification - Found columns:', results.map(r => r.column_name));
    
  } catch (error) {
    console.error('❌ Error adding profile fields:', error);
  } finally {
    await sequelize.close();
  }
}

addProfileFields(); 