import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerPhysicalEvaluation } from '../controller/PhysicalEvaluationController.js';

const router = express.Router();

// ENDPOINT - REGISTER PHYSICAL EVALUATION
router.post('/physical-evaluation', verifyToken, registerPhysicalEvaluation);

export default router; 