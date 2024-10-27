import Budget from '../model/Budget.js';

const sequelize = Budget.sequelize;

export const registerBudget = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const treatments_json = req.body.treatments_json;
    const { patient_id } = req.body;
    for await (const item of treatments_json) {
      await Budget.create({
        treatment: item.treatment,
        cost: item.cost,
        patient_id,
      });
    }
    await transaction.commit();
    res.json({ message: 'Budget registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering treatment.', error);
    res.status(500).send('Internal Server Error.');
  }
};