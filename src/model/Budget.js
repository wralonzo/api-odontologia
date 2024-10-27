import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';
import Patient from './Patient.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const Budget = sequelize.define('budget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  treatment: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  creation_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});
Budget.belongsTo(Patient, { foreignKey: 'patient_id' });
export default Budget;