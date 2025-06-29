import { Sequelize } from 'sequelize';
import config from '../config.js';

// Create Sequelize instance
const sequelize = new Sequelize(config.DATABASE.database, config.DATABASE.username, config.DATABASE.password, {
  host: config.DATABASE.host,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is needed for most cloud DBs!
    }
  }
});

// Import DataTypes for model definitions
import { DataTypes } from 'sequelize';

// Define User model
const User = sequelize.define('User', {
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
  first_name: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  last_name: { 
    type: DataTypes.STRING, 
    allowNull: true 
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
  }
}, { 
  timestamps: true,
  tableName: 'Users'
});

// Define DNS_Analysis model
const DNSAnalysis = sequelize.define('DNS_Analysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  domain_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  analysis_data: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Complete DNS analysis with use cases for each record type (A, AAAA, MX, NS, SOA, CAA, TXT, SPF, DMARC, DKIM)'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'DNS_Analysis',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['domain_name']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Define associations
User.hasMany(DNSAnalysis, { foreignKey: 'user_id' });
DNSAnalysis.belongsTo(User, { foreignKey: 'user_id' });

// Export models and sequelize instance
export { sequelize, User, DNSAnalysis };
export default sequelize; 