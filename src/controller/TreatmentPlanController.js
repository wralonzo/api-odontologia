import TreatmentPlan from '../model/TreatmentPlan.js';

const sequelize = TreatmentPlan.sequelize;

export const registerTreatmentPlan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { plan_details, estimated_cost, treatment_category_id } = req.body;
    await TreatmentPlan.create({ plan_details: plan_details, estimated_cost: estimated_cost, treatment_category_id: treatment_category_id });
    await transaction.commit();
    res.json({ message: 'Treatment Plan registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering Treatment Plan.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateTreatmentPlan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, plan_details, estimated_cost, treatment_category_id } = req.body;
    const existingTreatmentPlan = await TreatmentPlan.findByPk(id, { transaction });
    if (!existingTreatmentPlan) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment Plan record does not exist.' });
    }
    await TreatmentPlan.update(
      { id: id, plan_details: plan_details, estimated_cost: estimated_cost, treatment_category_id: treatment_category_id },
      {
        where: { id: id } // Condición where necesaria
      });

    await transaction.commit();
    res.json({ message: 'Treatment Plan updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating Treatment Plan.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyTreatmentPlan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingTreatmentPlan = await TreatmentPlan.findByPk(id);
    if (!existingTreatmentPlan) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Treatment Plan record does not exist.' });
    }
    if (!existingTreatmentPlan.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment Plan record has already been logically deleted.' });
    }
    await TreatmentPlan.update(
      { status: true, },
      {
        where: { id: id } // Condición where necesaria
      });
    await transaction.commit();
    res.status(200).json({ message: 'Treatment Plan record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting Treatment Plan logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const treatmentPlanList = async (req, res, next) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        tp.id AS treatment_plan_id,
        tp.plan_details,
        tp.estimated_cost,
        tp.createdAt AS treatment_plan_created_at,
        tc.id AS treatment_category_id,
        tc.name AS treatment_category_name,
        tc.createdAt AS treatment_category_created_at
      FROM 
        treatment_plan tp
      INNER JOIN 
        treatment_category tc 
      ON 
        tp.treatment_category_id = tc.id
      WHERE 
        tp.status = TRUE AND tc.status = TRUE;
    `);
    const records = results || [];
    if (records.length === 0) {
      return res.status(404).json({ message: 'No Treatment Plans found.' });
    }
    res.json({
      totalTreatmentPlans: records.length,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of Treatment Plans', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const treatmentPlanListNotPage = async (req, res, next) => {
  try {
    const records = await TreatmentPlan.findAll({
      where: { status: true }
    });
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No se encontraron registros de Planes de Tratamiento.' });
    }
    res.json({
      totalTreatmentPlans: records.length,
      records: records
    });
  } catch (error) {
    console.error('Error al mostrar la lista de registros de Planes de Tratamiento', error);
    res.status(500).send('Error Interno del Servidor.');
  }
};