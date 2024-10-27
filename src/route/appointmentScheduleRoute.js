import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { registerAppointment, updateAppointment, deleteLogicallyAppointment, appointmentList, scheduleList } from '../controller/AppointmentSchedule.js';

const router = express.Router();

// ENDPOINT - REGISTER APPOINTMENT AND SCHEDULE
router.post('/appointment', verifyToken, registerAppointment);

// ENDPOINT - UPDATE APPOINTMENT AND SCHEDULE
router.put('/appointment/:id', verifyToken, updateAppointment);

// ENDPOIN - DELETE LOGICALLY APPOINTMENT AND SCHEDULE
router.patch('/appointment', verifyToken, deleteLogicallyAppointment);

// ENDPOINT - APPOINTMENT LIST
router.get('/appointment', verifyToken, appointmentList);

// ENDPOINT - SCHEDULE LIST (ahora recibe el userId como parámetro en la URL)
router.get('/schedule/:userId', scheduleList);


export default router;