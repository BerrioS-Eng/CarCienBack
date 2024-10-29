import express from "express";
import { getAll } from '../controllers/appointmentController.js';

const appointmentRoute = express.Router();

appointmentRoute.get('/all', getAll);
/*
appointmentRoute.get('/single/:id', Appointment);

appointmentRoute.post('/create', Appointment);

appointmentRoute.put('/update/:id', Appointment);

appointmentRoute.delete('/delete/:id', Appointment);
*/

export default appointmentRoute;