import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const HealthQuestionnaire = sequelize.define('health_questionnaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hypertension: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  hypertension_control: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  diabetes: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  diabetes_control: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  hospitalization: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  medicine_allergy: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  bleeding: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  serious_illnesses: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pregnancy: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  pregnancy_months: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  recent_meal: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  recent_symptoms: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  creation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

export default HealthQuestionnaire;