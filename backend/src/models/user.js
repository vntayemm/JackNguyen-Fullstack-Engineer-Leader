import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verification_token: { type: DataTypes.STRING, allowNull: true },
  reset_token: { type: DataTypes.STRING, allowNull: true },
  reset_token_expires: { type: DataTypes.DATE, allowNull: true },
}, { timestamps: true });

export default User; 