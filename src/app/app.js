import express from 'express';
import cors from 'cors';
import logger from 'morgan';

// Import routes
import userRoute from '../route/userRoute.js'
import patientRoute from '../route/patientRoute.js'
import healthQuestionnaireRoute from '../route/healthQuestionnaireRoute.js'
import physicalEvaluationRoute from '../route/physicalEvaluationRoute.js'
import treatmentRoute from '../route/treatmentRoute.js'
import budgetRoute from '../route/budgetRoute.js'
import medicalImageRoute from '../route/medicalImageRoute.js'
import appointmentScheduleRoute from '../route/appointmentScheduleRoute.js'
import clinicalHistoryRoute from '../route/clinicalHistoryRoute.js'
import treatmentPlanRoute from '../route/treatmentPlanRoute.js'
import treatmentCategoryRoute from '../route/treatmentCategoryRoute.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// Use routes
app.use('/api', userRoute);
app.use('/api', patientRoute);
app.use('/api', healthQuestionnaireRoute);
app.use('/api', physicalEvaluationRoute);
app.use('/api', treatmentRoute);
app.use('/api', budgetRoute);
app.use('/api', medicalImageRoute);
app.use('/api', appointmentScheduleRoute);
app.use('/api', clinicalHistoryRoute);
app.use('/api', treatmentPlanRoute);
app.use('/api', treatmentCategoryRoute);

export default app; 