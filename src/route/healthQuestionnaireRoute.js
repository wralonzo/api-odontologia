import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerHealthQuestionnaire } from '../controller/HealthQuestionnaireController.js';

const router = express.Router();

// ENDPOINT - REGISTER HEALTH QUESTIONNARIE
router.post('/health-questionnarie', verifyToken, registerHealthQuestionnaire);

export default router; 