import Treatment from '../model/Treatment.js';

const sequelize = Treatment.sequelize;

export const registerTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const treatments_json = JSON.stringify(req.body.treatments_json);
    const { patient_id } = req.body;
    await Treatment.create({ treatments_json, patient_id });
    await transaction.commit();
    res.json({ message: 'Treatment registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering treatment.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const getTotalCost = async (req, res) => {
  try {
    const totalCost = await Treatment.sum('cost');
    res.json({ totalCost });
  } catch (error) {
    console.error('Error calculating total cost:', error);
    res.status(500).send('Internal Server Error.');
  }
};