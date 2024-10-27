import TreatmentCategory from '../model/TreatmentCategory.js';

const sequelize = TreatmentCategory.sequelize;

export const registerTreatmentCategory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name } = req.body;
    await TreatmentCategory.create({ name: name });
    await transaction.commit();
    res.json({ message: 'Treatment Category registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering Treatment Category.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateTreatmenCategory = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    const existingTreatmentPlan = await TreatmentCategory.findOne({ where: { id } });
    if (!existingTreatmentPlan) {
      return res.status(400).json({ message: 'Treatment Plan record does not exist.' });
    }
    console.log(existingTreatmentPlan);
    await TreatmentCategory.update(
      { name },
      {
        where: { id: id } // Condición where necesaria
      });
    res.json({ message: 'Treatment Category updated successfully.' });
  } catch (error) {
    console.error('Error updating Treatment Category.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyTreatmentCategory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingTreatmentPlan = await TreatmentCategory.findByPk(id);
    if (!existingTreatmentPlan) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Treatment Category record does not exist.' });
    }
    if (!existingTreatmentPlan.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment Category record has already been logically deleted.' });
    }
    await TreatmentCategory.update({ status: false }, {
      where: { id: id } // Condición where necesaria
    });
    await transaction.commit();
    res.status(200).json({ message: 'Treatment Category record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting Treatment Category logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const getTreatmentCategories = async (req, res, next) => {
  try {
    const treatmentCategories = await TreatmentCategory.findAll({
      where: { status: true }
    });
    res.status(200).json(treatmentCategories);
  } catch (error) {
    console.error('Error retrieving Treatment Categories.', error);
    res.status(500).send('Internal Server Error.');
  }
};