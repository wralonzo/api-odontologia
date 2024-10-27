import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerUser, loginUser, updateUser, deleteLogicallyUser, userList, listDoctors, totalDoctors } from '../controller/UserController.js';

const router = express.Router();

// ENDPOINT - REGISTER USER
router.post('/user', registerUser);

// ENDPOINT - LOGIN USER
router.post('/user/login', loginUser);

// ENDPOINT - UPDATE USER
router.put('/user/:id', verifyToken, updateUser);

// ENDPOIN - DELETE LOGICALLY
router.patch('/user', verifyToken, deleteLogicallyUser);

// ENDPOINT - USER LIST
router.get('/user', verifyToken, userList);

// ENDPOINT - USER DOCTORS
router.get('/user/doctors', verifyToken, listDoctors);

// ENDPOINT - GET TOTAL DOCTORS
router.get('/doctors/total', verifyToken, totalDoctors);

export default router;