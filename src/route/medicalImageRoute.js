import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerMedicalImage } from '../controller/MedicalImageController.js';

const router = express.Router();

// ENDPOINT - REGISTER MEDICAL IMAGE
router.post('/medical-image', verifyToken, registerMedicalImage);

export default router; 