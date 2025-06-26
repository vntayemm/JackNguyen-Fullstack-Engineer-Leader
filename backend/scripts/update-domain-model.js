import sequelize from '../src/models/index.js';

async function updateDomainModel() {
  try {
    console.log('Updating domains table with new columns...');
    
    // Add spf_result column
    await sequelize.query(`
      ALTER TABLE "Domains" 
      ADD COLUMN IF NOT EXISTS "spf_result" JSON
    `);
    
    // Add dmarc_result column
    await sequelize.query(`
      ALTER TABLE "Domains" 
      ADD COLUMN IF NOT EXISTS "dmarc_result" JSON
    `);
    
    // Add dns_result column
    await sequelize.query(`
      ALTER TABLE "Domains" 
      ADD COLUMN IF NOT EXISTS "dns_result" JSON
    `);
    
    // Add last_tested column
    await sequelize.query(`
      ALTER TABLE "Domains" 
      ADD COLUMN IF NOT EXISTS "last_tested" TIMESTAMP
    `);
    
    // Add user_id column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE "Domains" 
      ADD COLUMN IF NOT EXISTS "user_id" INTEGER
    `);
    
    console.log('✅ Successfully updated domains table');
    
    // Verify the columns exist
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Domains' 
      AND column_name IN ('spf_result', 'dmarc_result', 'dns_result', 'last_tested', 'user_id')
    `);
    
    console.log('Verification - Found columns:', results.map(r => r.column_name));
    
  } catch (error) {
    console.error('❌ Error updating domain model:', error);
  } finally {
    await sequelize.close();
  }
}

updateDomainModel(); 