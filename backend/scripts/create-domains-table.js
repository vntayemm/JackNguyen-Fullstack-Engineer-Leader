import sequelize from '../src/models/index.js';
import Domain from '../src/models/domain.js';

async function createDomainsTable() {
  try {
    console.log('Creating domains table...');
    
    // Sync the Domain model to create the table
    await Domain.sync({ force: false });
    
    console.log('✅ Successfully created domains table');
    
    // Verify the table exists
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'Domains'
    `);
    
    if (results.length > 0) {
      console.log('✅ Domains table verified');
      
      // Check columns
      const [columns] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Domains'
        ORDER BY column_name
      `);
      
      console.log('Table columns:', columns.map(c => c.column_name));
    } else {
      console.log('❌ Domains table not found');
    }
    
  } catch (error) {
    console.error('❌ Error creating domains table:', error);
  } finally {
    await sequelize.close();
  }
}

createDomainsTable(); 