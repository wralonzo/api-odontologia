import Patient from '../model/Patient.js';

const sequelize = Patient.sequelize;

export const registerPatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { full_name, address, email, phone, sex, birth_date, name_contact, relationship, emergency_phone } = req.body;
    const existingPatient = await Patient.findOne({ where: { full_name }, transaction });
    if (existingPatient) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The patient is already registered in the system.' });
    } else {
      await Patient.create({ full_name, address, email, phone, sex, birth_date, name_contact, relationship, emergency_phone });
      await transaction.commit();
      res.status(201).json({ message: 'Patient record created successfully.' });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering patient record.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updatePatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, full_name, address, email, phone, sex, birth_date, name_contact, relationship, emergency_phone } = req.body;
    const existingPatient = await Patient.findByPk(id, { transaction });
    if (!existingPatient) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Patient does not exist.' });
    }
    if (existingPatient.status === false) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Patient exists but is logically deleted.' });
    }
    await Patient.update(
      {
        id: id,
        full_name: full_name,
        address: address,
        email: email,
        phone: phone,
        sex: sex,
        birth_date: birth_date,
        name_contact: name_contact,
        relationship: relationship,
        emergency_phone: emergency_phone
      },
      {
        where: { id: id } // Condición where necesaria
      });
    await transaction.commit();
    res.json({ message: 'Patient updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating patient.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyPatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingPatient = await Patient.findByPk(id);
    if (!existingPatient) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Patient does not exist.' });
    }
    if (!existingPatient.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Patient has already been logically deleted.' });
    }
    await Patient.update(
      {
        status: true,
      },
      {
        where: { id: id },
      });
    await transaction.commit();
    res.status(200).json({ message: 'Patient logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting patient logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const patientList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalPatients = await Patient.count({ where: { status: true } });
    const patients = await Patient.findAll({
      where: { status: true },
      limit: numericLimit,
      offset
    });
    const totalPages = Math.ceil(totalPatients / numericLimit);
    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: 'No patients found.' });
    }
    res.json({
      totalPatients,
      totalPages,
      currentPage: numericPage,
      patients
    });
  } catch (error) {
    console.error('Error when displaying the list of patients', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const getTotalPatients = async (req, res, next) => {
  try {
    const totalPatients = await Patient.count({ where: { status: true } }); // Cuenta solo pacientes activos
    res.json({ totalPatients });
  } catch (error) {
    console.error('Error getting total patients', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const listMedicalImages = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { patient_id } = req.params;
    if (isNaN(patient_id)) {
      return res.status(400).json({ message: 'Invalid patient ID.' });
    }
    const images = await sequelize.query(
      `SELECT id, image_base_64, description, createdAt, updatedAt 
       FROM medical_image 
       WHERE patient_id = :patient_id`,
      {
        replacements: { patient_id },
        type: sequelize.QueryTypes.SELECT,
        transaction
      }
    );
    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'No medical images found for this patient.' });
    }
    await transaction.commit();
    res.json(images);
  } catch (error) {
    await transaction.rollback();
    console.error('Error retrieving medical images.', error);
    res.status(500).send('Internal Server Error.');
  }
};