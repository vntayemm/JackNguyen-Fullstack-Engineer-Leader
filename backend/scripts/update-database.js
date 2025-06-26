import sequelize from '../src/models/index.js';
import { DataTypes } from 'sequelize';

async function updateDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if the Users table exists (check both cases)
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    console.log('All tables in database:', tableExists);
    
    const usersTableExists = tableExists.some(table => 
      table.tableName === 'Users' || 
      table.tableName === 'users' ||
      table.tableName === '"Users"' ||
      table.tableName === '"users"'
    );

    console.log('Users table exists:', usersTableExists);

    if (!usersTableExists) {
      console.log('Users table does not exist. Creating it...');
      // Create the Users table with all required columns
      await sequelize.getQueryInterface().createTable('Users', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        password_hash: {
          type: DataTypes.STRING,
          allowNull: false
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        verification_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        reset_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        reset_token_expires: {
          type: DataTypes.DATE,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      });
      console.log('Users table created successfully.');
    } else {
      console.log('Users table exists. Checking for missing columns...');
      
      // Try to get table description with different table name variations
      let tableDescription;
      let tableName = 'Users';
      
      try {
        tableDescription = await sequelize.getQueryInterface().describeTable('Users');
        console.log('Found table with name: Users');
      } catch (error) {
        try {
          tableDescription = await sequelize.getQueryInterface().describeTable('users');
          tableName = 'users';
          console.log('Found table with name: users');
        } catch (error2) {
          console.error('Could not describe table with either Users or users:', error2.message);
          return;
        }
      }
      
      const existingColumns = Object.keys(tableDescription);
      console.log('Existing columns:', existingColumns);
      
      // Add missing columns
      const missingColumns = [];
      
      if (!existingColumns.includes('is_verified')) {
        missingColumns.push('is_verified');
      }
      if (!existingColumns.includes('verification_token')) {
        missingColumns.push('verification_token');
      }
      if (!existingColumns.includes('reset_token')) {
        missingColumns.push('reset_token');
      }
      if (!existingColumns.includes('reset_token_expires')) {
        missingColumns.push('reset_token_expires');
      }
      
      if (missingColumns.length > 0) {
        console.log('Adding missing columns:', missingColumns);
        
        for (const column of missingColumns) {
          try {
            switch (column) {
              case 'is_verified':
                await sequelize.getQueryInterface().addColumn(tableName, 'is_verified', {
                  type: DataTypes.BOOLEAN,
                  defaultValue: false
                });
                break;
              case 'verification_token':
                await sequelize.getQueryInterface().addColumn(tableName, 'verification_token', {
                  type: DataTypes.STRING,
                  allowNull: true
                });
                break;
              case 'reset_token':
                await sequelize.getQueryInterface().addColumn(tableName, 'reset_token', {
                  type: DataTypes.STRING,
                  allowNull: true
                });
                break;
              case 'reset_token_expires':
                await sequelize.getQueryInterface().addColumn(tableName, 'reset_token_expires', {
                  type: DataTypes.DATE,
                  allowNull: true
                });
                break;
            }
            console.log(`Column ${column} added successfully to table ${tableName}.`);
          } catch (error) {
            console.error(`Error adding column ${column}:`, error.message);
          }
        }
      } else {
        console.log('All required columns already exist.');
      }
    }
    
    // Verify the final table structure
    console.log('\nVerifying final table structure...');
    try {
      const finalDescription = await sequelize.getQueryInterface().describeTable('Users');
      console.log('Final Users table columns:', Object.keys(finalDescription));
    } catch (error) {
      try {
        const finalDescription = await sequelize.getQueryInterface().describeTable('users');
        console.log('Final users table columns:', Object.keys(finalDescription));
      } catch (error2) {
        console.error('Could not verify table structure:', error2.message);
      }
    }
    
    console.log('Database update completed successfully.');
  } catch (error) {
    console.error('Database update failed:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the update
updateDatabase();