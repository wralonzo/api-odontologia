import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const Patient = sequelize.define('patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  sex: {
    type: DataTypes.CHAR(1),
    allowNull: false
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  name_contact: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  relationship: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  emergency_phone: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

export default Patient;