import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerBudget } from '../controller/BudgetController.js';

const router = express.Router();

// ENDPOINT - REGISTER BUDGET
router.post('/budget', verifyToken, registerBudget);

export default router; 