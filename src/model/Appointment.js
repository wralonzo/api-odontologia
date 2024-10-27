import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';
import Patient from './Patient.js';
import User from './User.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const Appointment = sequelize.define('appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  appointment_datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  state: {
    type: DataTypes.ENUM('PROGRAMADA', 'CANCELADA', 'CONFIRMADA', 'COMPLETADA'),
    defaultValue: 'PROGRAMADA'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  code_id: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.belongsTo(User, { foreignKey: 'user_id' });

export default Appointment;