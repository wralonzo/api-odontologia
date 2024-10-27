import HealthQuestionnaire from '../model/HealthQuestionnaire.js';

const sequelize = HealthQuestionnaire.sequelize;

export const registerHealthQuestionnaire = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      hypertension,
      hypertension_control,
      diabetes,
      diabetes_control,
      hospitalization,
      medicine_allergy,
      bleeding,
      serious_illnesses,
      pregnancy,
      pregnancy_months,
      recent_meal,
      recent_symptoms,
      patient_id
    } = req.body;

    await HealthQuestionnaire.create({
      hypertension,
      hypertension_control,
      diabetes,
      diabetes_control,
      hospitalization,
      medicine_allergy,
      bleeding,
      serious_illnesses,
      pregnancy,
      pregnancy_months,
      recent_meal,
      recent_symptoms,
      patient_id
    });
    await transaction.commit();
    res.json({ message: 'Health Questionnaire registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering Health Questionnaire.', error);
    res.status(500).send('Internal Server Error.');
  }
};