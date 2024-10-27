import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerTreatment, getTotalCost } from '../controller/TreatmentController.js';

const router = express.Router();

// ENDPOINT - REGISTER TREATMENT
router.post('/treatment', verifyToken, registerTreatment);

// ENDPOINT - GET COST TOTAL
router.get('/treatment', verifyToken, getTotalCost);

export default router; 