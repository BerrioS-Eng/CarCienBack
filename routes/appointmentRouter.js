import express from "express";
import Appointment from '../controllers/appointmentModel.js';

const appointmentRoute = express.Router();

appointmentRoute.get('/all-appointment', Appointment);

appointmentRoute.get('/single-appointment/:id', Appointment);

appointmentRoute.post('/create-appointment', Appointment);

appointmentRoute.put('/update-appointment/:id', Appointment);

appointmentRoute.delete('/delete-appointment/:id', Appointment);


export default appointmentRoute;