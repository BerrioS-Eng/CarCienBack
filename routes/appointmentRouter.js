import express from "express";
import { getAll, create } from '../controllers/appointmentController.js';

const appointmentRoute = express.Router();

appointmentRoute.get('/all', getAll);

appointmentRoute.get('/single/:id', Appointment);

appointmentRoute.post('/create', create);
/*
appointmentRoute.put('/update/:id', Appointment);

appointmentRoute.delete('/delete/:id', Appointment);
*/

export default appointmentRoute;