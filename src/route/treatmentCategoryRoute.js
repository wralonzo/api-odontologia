import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerTreatmentCategory, updateTreatmenCategory, deleteLogicallyTreatmentCategory, getTreatmentCategories } from '../controller/TreatmentCategory.js';

const router = express.Router();

// ENDPOINT - REGISTER TREATMENT PLAN
router.post('/treatment-category', verifyToken, registerTreatmentCategory);

// ENDPOINT - UPDATE TREATMENT PLAN
router.put('/treatment-category/:id', verifyToken, updateTreatmenCategory);

// ENDPOIN - DELETE TREATMENT PLAN
router.patch('/treatment-category', verifyToken, deleteLogicallyTreatmentCategory);

router.get('/treatment-category', verifyToken, getTreatmentCategories);

export default router; 