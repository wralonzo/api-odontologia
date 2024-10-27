import ClinicalHistory from '../model/ClinicalHistory.js';

const sequelize = ClinicalHistory.sequelize;

export const registerClinicalHistory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { patient_id, details, date } = req.body;
    await ClinicalHistory.create({ patient_id: patient_id, details: details, date: date });
    await transaction.commit();
    res.json({ message: 'Clinical history registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering clinical history.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateClinicalHistory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, patient_id, details, date } = req.body;
    const existingRecord = await ClinicalHistory.findByPk(id, { transaction });
    if (!existingRecord) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Clinical history record does not exist.' });
    }
    await ClinicalHistory.update(
      { id: id, patient_id: patient_id, description: description, date: date },
      {
        where: { id: id } // Condición where necesaria
      });
    await transaction.commit();
    res.json({ message: 'Clinical history updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating clinical history.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyClinicalHistory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingRecord = await ClinicalHistory.findByPk(id);
    if (!existingRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Clinical history record does not exist.' });
    }
    if (!existingRecord.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Clinical history record has already been logically deleted.' });
    }
    await ClinicalHistory.update(
      { status: false },
      {
        where: { id: id } // Condición where necesaria
      });
    await transaction.commit();
    res.status(200).json({ message: 'Clinical history record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting clinical history logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const clinicalHistoryList = async (req, res, next) => {
  try {
    const { id: patient_id } = req.params;
    const whereClause = { status: true };
    if (patient_id) {
      whereClause.patient_id = patient_id;
    }
    const records = await ClinicalHistory.findAll({
      where: whereClause,
    });
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No clinical history records found.' });
    }
    res.json({
      totalRecords: records.length,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of clinical history records', error);
    res.status(500).send('Internal Server Error.');
  }
};