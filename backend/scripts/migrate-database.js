#!/usr/bin/env node

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'dpg-d1eaaf2li9vc739r9nbg-a.singapore-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'domain_validator_db',
  username: process.env.DB_USER || 'jack_nguyen',
  password: process.env.DB_PASSWORD || 'DumPdGrF9K5y3EXVMzqj7nDggCquRGsv',
  dialect: process.env.DB_DIALECT || 'postgres',
  ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST !== 'localhost' ? {
    require: true,
    rejectUnauthorized: false
  } : false
};

// Complete database schema for fresh initialization
const completeSchemaSQL = `
-- DNS Validator Complete Database Schema
-- Generated for ${dbConfig.dialect.toUpperCase()}

-- USERS TABLE
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DOMAINS TABLE (Current schema)
CREATE TABLE IF NOT EXISTS "Domains" (
    id SERIAL PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL,
    dns_provider VARCHAR(255) DEFAULT 'Unknown',
    hosting_provider VARCHAR(255) DEFAULT 'Unknown',
    dns_record_published BOOLEAN DEFAULT FALSE,
    dmarc_record_published BOOLEAN DEFAULT FALSE,
    spf_record_published BOOLEAN DEFAULT FALSE,
    status VARCHAR(255) DEFAULT 'pending',
    use_cases JSON,
    user_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DNS_ANALYSIS TABLE (Legacy table - kept for backward compatibility)
CREATE TABLE IF NOT EXISTS "DNS_Analysis" (
    id SERIAL PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL,
    dns_provider VARCHAR(255) DEFAULT 'Unknown',
    hosting_provider VARCHAR(255) DEFAULT 'Unknown',
    dns_record_published BOOLEAN DEFAULT FALSE,
    dmarc_record_published BOOLEAN DEFAULT FALSE,
    spf_record_published BOOLEAN DEFAULT FALSE,
    success BOOLEAN DEFAULT FALSE,
    analysis_data JSON NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON "Domains"(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_domain_name ON "Domains"(domain_name);
CREATE INDEX IF NOT EXISTS idx_users_email ON "Users"(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON "Users"(username);
CREATE INDEX IF NOT EXISTS idx_dns_analysis_user_id ON "DNS_Analysis"(user_id);
CREATE INDEX IF NOT EXISTS idx_dns_analysis_domain_name ON "DNS_Analysis"(domain_name);
CREATE INDEX IF NOT EXISTS idx_dns_analysis_created_at ON "DNS_Analysis"("createdAt");

-- Add comments for documentation
COMMENT ON TABLE "Users" IS 'User accounts for DNS validator application';
COMMENT ON TABLE "Domains" IS 'DNS domains associated with users - current schema';
COMMENT ON TABLE "DNS_Analysis" IS 'Legacy DNS analysis results - kept for backward compatibility';
COMMENT ON COLUMN "Users".is_verified IS 'Email verification status';
COMMENT ON COLUMN "Domains".use_cases IS 'Analysis results for each DNS record type in JSON format';
COMMENT ON COLUMN "Domains".dns_record_published IS 'Whether DNS records are properly published';
COMMENT ON COLUMN "Domains".dmarc_record_published IS 'Whether DMARC record is published';
COMMENT ON COLUMN "Domains".spf_record_published IS 'Whether SPF record is published';
COMMENT ON COLUMN "DNS_Analysis".analysis_data IS 'Legacy complete DNS analysis with use cases for each record type';
`;

// MySQL version of the complete schema
const mysqlCompleteSchemaSQL = `
-- DNS Validator Complete Database Schema
-- Generated for MySQL

-- USERS TABLE
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_verified TINYINT(1) DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DOMAINS TABLE (Current schema)
CREATE TABLE IF NOT EXISTS Domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL,
    dns_provider VARCHAR(255) DEFAULT 'Unknown',
    hosting_provider VARCHAR(255) DEFAULT 'Unknown',
    dns_record_published TINYINT(1) DEFAULT FALSE,
    dmarc_record_published TINYINT(1) DEFAULT FALSE,
    spf_record_published TINYINT(1) DEFAULT FALSE,
    status VARCHAR(255) DEFAULT 'pending',
    use_cases JSON,
    user_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- DNS_ANALYSIS TABLE (Legacy table - kept for backward compatibility)
CREATE TABLE IF NOT EXISTS DNS_Analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL,
    dns_provider VARCHAR(255) DEFAULT 'Unknown',
    hosting_provider VARCHAR(255) DEFAULT 'Unknown',
    dns_record_published TINYINT(1) DEFAULT FALSE,
    dmarc_record_published TINYINT(1) DEFAULT FALSE,
    spf_record_published TINYINT(1) DEFAULT FALSE,
    success TINYINT(1) DEFAULT FALSE,
    analysis_data JSON NOT NULL,
    user_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_domains_user_id ON Domains(user_id);
CREATE INDEX idx_domains_domain_name ON Domains(domain_name);
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_dns_analysis_user_id ON DNS_Analysis(user_id);
CREATE INDEX idx_dns_analysis_domain_name ON DNS_Analysis(domain_name);
CREATE INDEX idx_dns_analysis_created_at ON DNS_Analysis(createdAt);
`;

// SQLite version of the complete schema
const sqliteCompleteSchemaSQL = `
-- DNS Validator Complete Database Schema
-- Generated for SQLite

-- USERS TABLE
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expires TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- DOMAINS TABLE (Current schema)
CREATE TABLE IF NOT EXISTS Domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_name TEXT NOT NULL,
    dns_provider TEXT DEFAULT 'Unknown',
    hosting_provider TEXT DEFAULT 'Unknown',
    dns_record_published INTEGER DEFAULT 0,
    dmarc_record_published INTEGER DEFAULT 0,
    spf_record_published INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    use_cases TEXT,
    user_id INTEGER NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- DNS_ANALYSIS TABLE (Legacy table - kept for backward compatibility)
CREATE TABLE IF NOT EXISTS DNS_Analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_name TEXT NOT NULL,
    dns_provider TEXT DEFAULT 'Unknown',
    hosting_provider TEXT DEFAULT 'Unknown',
    dns_record_published INTEGER DEFAULT 0,
    dmarc_record_published INTEGER DEFAULT 0,
    spf_record_published INTEGER DEFAULT 0,
    success INTEGER DEFAULT 0,
    analysis_data TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON Domains(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_domain_name ON Domains(domain_name);
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);
CREATE INDEX IF NOT EXISTS idx_dns_analysis_user_id ON DNS_Analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_dns_analysis_domain_name ON DNS_Analysis(domain_name);
CREATE INDEX IF NOT EXISTS idx_dns_analysis_created_at ON DNS_Analysis(createdAt);
`;

async function initializeDatabase() {
  let sequelize;
  try {
    console.log('🚀 Starting database initialization...');
    
    // Create Sequelize instance based on dialect
    const dialectOptions = {};
    
    if (dbConfig.dialect === 'postgres') {
      dialectOptions.ssl = dbConfig.ssl;
      // For cloud databases, always enable SSL
      if (dbConfig.host !== 'localhost' && dbConfig.host !== '127.0.0.1') {
        dialectOptions.ssl = {
          require: true,
          rejectUnauthorized: false
        };
      }
    }
    
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: false,
      dialectOptions
    });
    
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Choose the appropriate schema based on dialect
    let schemaSQL;
    switch (dbConfig.dialect) {
      case 'mysql':
        schemaSQL = mysqlCompleteSchemaSQL;
        break;
      case 'sqlite':
        schemaSQL = sqliteCompleteSchemaSQL;
        break;
      case 'postgres':
      default:
        schemaSQL = completeSchemaSQL;
        break;
    }
    
    // Execute the complete schema
    console.log('📋 Creating database schema...');
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sequelize.query(statement);
        } catch (error) {
          // Ignore errors for IF NOT EXISTS statements
          if (!error.message.includes('already exists')) {
            console.warn(`⚠️  Warning executing statement: ${error.message}`);
          }
        }
      }
    }
    
    console.log('✅ Database schema created successfully!');
    
    // Verify tables exist
    console.log('🔍 Verifying table creation...');
    const tables = ['Users', 'Domains', 'DNS_Analysis'];
    
    for (const table of tables) {
      try {
        const [results] = await sequelize.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${table}'
          );
        `);
        
        if (results[0].exists) {
          console.log(`✅ Table "${table}" exists`);
        } else {
          console.log(`❌ Table "${table}" not found`);
        }
      } catch (error) {
        console.log(`⚠️  Could not verify table "${table}": ${error.message}`);
      }
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}

async function migrateDatabase() {
  let sequelize;
  try {
    console.log('🔄 Starting database migration...');
    
    // Test connection
    sequelize = new Sequelize(config.DATABASE.database, config.DATABASE.username, config.DATABASE.password, {
      host: config.DATABASE.host,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
    
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Check if DNS_Analysis table exists
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'DNS_Analysis'
      );
    `);
    
    const dnsAnalysisExists = results[0].exists;
    
    if (!dnsAnalysisExists) {
      console.log('📋 Creating DNS_Analysis table...');
      await sequelize.query(`
        CREATE TABLE "DNS_Analysis" (
          id SERIAL PRIMARY KEY,
          domain_name VARCHAR(255) NOT NULL,
          analysis_data JSON NOT NULL,
          user_id INTEGER NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
          "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
          FOREIGN KEY (user_id) REFERENCES "Users"(id) ON DELETE CASCADE
        );
      `);
      
      // Create indexes
      await sequelize.query(`
        CREATE INDEX "DNS_Analysis_user_id_idx" ON "DNS_Analysis"(user_id);
        CREATE INDEX "DNS_Analysis_domain_name_idx" ON "DNS_Analysis"(domain_name);
        CREATE INDEX "DNS_Analysis_createdAt_idx" ON "DNS_Analysis"("createdAt");
      `);
      
      console.log('✅ DNS_Analysis table created successfully.');
    } else {
      console.log('ℹ️  DNS_Analysis table already exists.');
    }
    
    // Check if Domains table exists
    const [domainResults] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Domains'
      );
    `);
    
    const domainsExists = domainResults[0].exists;
    
    if (domainsExists) {
      console.log('🔄 Domains table exists. Migrating data to DNS_Analysis...');
      
      // Get all domains
      const [domains] = await sequelize.query(`
        SELECT * FROM "Domains" ORDER BY "createdAt";
      `);
      
      console.log(`📊 Found ${domains.length} domains to migrate.`);
      
      for (const domain of domains) {
        const now = new Date();
        
        // Create analysis data from domain record
        const analysisData = {
          domain: domain.domain_name,
          dns_provider: domain.dns_provider || 'Unknown',
          hosting_provider: domain.hosting_provider || 'Unknown',
          dns_record_published: domain.dns_record_published || false,
          dmarc_record_published: domain.dmarc_record_published || false,
          spf_record_published: domain.spf_record_published || false,
          status: 'migrated',
          createdAt: domain.createdAt || now,
          updatedAt: domain.updatedAt || now,
          use_cases: {
            ...(domain.dns_result || {}),
            ...(domain.spf_result ? { SPF: domain.spf_result } : {}),
            ...(domain.dmarc_result ? { DMARC: domain.dmarc_result } : {}),
            createdAt: domain.createdAt || now,
            updatedAt: domain.updatedAt || now
          }
        };
        
        // Insert into DNS_Analysis
        await sequelize.query(`
          INSERT INTO "DNS_Analysis" (domain_name, analysis_data, user_id, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5)
        `, {
          bind: [
            domain.domain_name,
            JSON.stringify(analysisData),
            domain.user_id,
            domain.createdAt || now,
            domain.updatedAt || now
          ]
        });
        
        console.log(`✅ Migrated domain: ${domain.domain_name}`);
      }
      
      console.log('✅ Data migration completed successfully.');
      
      // Drop the Domains table
      console.log('🗑️  Dropping Domains table...');
      await sequelize.query(`
        DROP TABLE "Domains" CASCADE;
      `);
      
      console.log('✅ Domains table dropped successfully.');
    } else {
      console.log('ℹ️  Domains table does not exist. No migration needed.');
    }
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}

// Function to create .env file template
function createEnvTemplate() {
  const envTemplate = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dns_validator
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres
DB_SSL=false

# Optional: Override with your specific database settings
# DB_DIALECT can be: postgres, mysql, sqlite
# DB_SSL should be: true for cloud databases, false for local
`;

  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    console.log('📄 Created .env template file');
    console.log('⚠️  Please update the .env file with your database credentials');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 DNS Validator Database Migration Script

Usage:
  node migrate-database.js [options]

Options:
  --help, -h          Show this help message
  --create-env        Create .env template file
  --dry-run           Show what would be executed without running
  --init              Initialize fresh database schema (recommended for new databases)
  --migrate           Run legacy migration (for existing databases)

Environment Variables:
  DB_HOST            Database host (default: localhost)
  DB_PORT            Database port (default: 5432)
  DB_NAME            Database name (default: dns_validator)
  DB_USER            Database username (default: postgres)
  DB_PASSWORD        Database password
  DB_DIALECT         Database dialect: postgres, mysql, sqlite (default: postgres)
  DB_SSL             Enable SSL: true/false (default: false)

Examples:
  # Initialize fresh database (recommended for new databases)
  node migrate-database.js --init

  # Run legacy migration (for existing databases)
  node migrate-database.js --migrate

  # Run with default PostgreSQL settings
  node migrate-database.js

  # Run with custom MySQL settings
  DB_DIALECT=mysql DB_HOST=localhost DB_NAME=dns_validator node migrate-database.js --init

  # Create .env template
  node migrate-database.js --create-env
    `);
    return;
  }

  if (args.includes('--create-env')) {
    createEnvTemplate();
    return;
  }

  if (args.includes('--dry-run')) {
    console.log('🔍 DRY RUN - Complete schema that would be executed:');
    console.log('='.repeat(50));
    console.log(completeSchemaSQL);
    console.log('='.repeat(50));
    console.log('💡 To actually run the initialization, use: node migrate-database.js --init');
    return;
  }

  // Check if required environment variables are set
  if (!process.env.DB_PASSWORD && dbConfig.dialect !== 'sqlite') {
    console.error('❌ Error: DB_PASSWORD environment variable is required');
    console.log('💡 You can:');
    console.log('   1. Set DB_PASSWORD environment variable');
    console.log('   2. Create a .env file with your database credentials');
    console.log('   3. Run: node migrate-database.js --create-env');
    process.exit(1);
  }

  // Determine which operation to run
  if (args.includes('--init')) {
    console.log('🎯 Running database initialization...');
    await initializeDatabase();
  } else if (args.includes('--migrate')) {
    console.log('🔄 Running legacy migration...');
    await migrateDatabase();
  } else {
    // Default behavior: run initialization
    console.log('🎯 Running database initialization (default)...');
    console.log('💡 Use --migrate flag for legacy migration');
    await initializeDatabase();
  }
}

// Run the script
main().catch(console.error); 