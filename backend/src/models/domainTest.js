import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Domain from './domain.js';

const DomainTest = sequelize.define('DomainTest', {
  test_type: { type: DataTypes.STRING, allowNull: false },
  result: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.JSONB },
}, { timestamps: true });

DomainTest.belongsTo(Domain, { foreignKey: 'domain_id' });
Domain.hasMany(DomainTest, { foreignKey: 'domain_id' });

export default DomainTest; 