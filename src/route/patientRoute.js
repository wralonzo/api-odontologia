import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerPatient, updatePatient, deleteLogicallyPatient, patientList, getTotalPatients, listMedicalImages } from '../controller/PatientController.js';

const router = express.Router();

// ENDPOINT - REGISTER PATIENT
router.post('/patient', verifyToken, registerPatient);

// ENDPOINT - UPDATE PATIENT
router.put('/patient/:id', verifyToken, updatePatient);

// ENDPOIN - DELETE LOGICALLY PATIENT
router.patch('/patient', verifyToken, deleteLogicallyPatient);

// ENDPOINT - PATIENT LIST
router.get('/patient', verifyToken, patientList);

// ENDPOINT - GET TOTAL NUMBER OF PATIENTS
router.get('/patients/total', verifyToken, getTotalPatients);

// ENDPOINT - LIST MEDICAL IMAGES FOR A PATIENT
router.get('/patient/:patient_id/images', verifyToken, listMedicalImages);

export default router;