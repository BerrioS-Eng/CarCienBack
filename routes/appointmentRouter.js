import express from "express";
import Appointment from '../controllers/appointmentController.js';

const appointmentRoute = express.Router();

appointmentRoute.get('/all', Appointment);

appointmentRoute.get('/single/:id', Appointment);

appointmentRoute.post('/create', Appointment);

appointmentRoute.put('/update/:id', Appointment);

appointmentRoute.delete('/delete/:id', Appointment);


export default appointmentRoute;