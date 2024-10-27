import formidable from 'formidable';
import fs from 'fs/promises';
import MedicalImage from '../model/MedicalImage.js';

const sequelize = MedicalImage.sequelize;

export const registerMedicalImage = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  const form = formidable({
    keepExtensions: true,
    multiples: false
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: 'Error parsing the form data.' });
    }
    try {
      const { description, patient_id } = fields;
      const imageFile = files.image_base_64[0];
      if (!imageFile || !imageFile.filepath) {
        return res.status(400).json({ message: 'No file uploaded or file path is missing.' });
      }
      const imageBuffer = await fs.readFile(imageFile.filepath);


      await MedicalImage.create({
        image_base_64: imageBuffer,
        description: description[0],
        patient_id: patient_id[0],
      });
      await transaction.commit();
      res.json({ message: 'Medical image registered successfully.' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error registering medical image.', error);
      res.status(500).send('Internal Server Error.');
    }
  });
};