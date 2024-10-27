import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';
import TreatmentCategory from './TreatmentCategory.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const TreatmentPlan = sequelize.define('treatment_plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plan_details: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});
TreatmentPlan.belongsTo(TreatmentCategory, { foreignKey: 'treatment_category_id' });
export default TreatmentPlan;