import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerClinicalHistory, updateClinicalHistory, deleteLogicallyClinicalHistory, clinicalHistoryList } from '../controller/ClinicalHistoryController.js';

const router = express.Router();

// ENDPOINT - REGISTER CLINICAL HOSTORY
router.post('/clinical-history', verifyToken, registerClinicalHistory);

// ENDPOINT - UPDATE CLINICAL HOSTORY
router.put('/clinical-history/:id', verifyToken, updateClinicalHistory);

// ENDPOIN - DELETE LOGICALLY CLINICAL HOSTORY
router.patch('/clinical-history', verifyToken, deleteLogicallyClinicalHistory);

// ENDPOINT - CLINICAL HISTORY LIST FOR A PATIENT
router.get('/clinical-history/patient/:id', verifyToken, clinicalHistoryList);

export default router; 