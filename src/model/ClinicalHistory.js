import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';
import Patient from './Patient.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const ClinicalHistory = sequelize.define('clinical_history', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

ClinicalHistory.belongsTo(Patient, { foreignKey: 'patient_id' });

export default ClinicalHistory;