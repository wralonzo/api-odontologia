import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';
import Appointment from './Appointment.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const Schedule = sequelize.define('schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

Schedule.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Appointment.hasOne(Schedule, { foreignKey: 'appointment_id' });

export default Schedule;