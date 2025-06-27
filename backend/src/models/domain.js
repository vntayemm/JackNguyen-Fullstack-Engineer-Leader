import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const Domain = sequelize.define('Domain', {
  domain_name: { type: DataTypes.STRING, allowNull: false },
  spf_result: { type: DataTypes.JSON, allowNull: true },
  dmarc_result: { type: DataTypes.JSON, allowNull: true },
  dns_result: { type: DataTypes.JSON, allowNull: true },
  last_tested: { type: DataTypes.DATE, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

Domain.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Domain, { foreignKey: 'user_id' });

export default Domain; 