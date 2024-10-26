import express from "express";
import Appointment from '../controllers/appointmentModel.js';
const appointmentRoute = express.Router();

appointmentRoute.get('/', Appointment);

appointmentRoute.get('/:id', Appointment);

appointmentRoute.post('/', Appointment);

appointmentRoute.put('/:id', Appointment);

appointmentRoute.delete('/:id', Appointment);


export default appointmentRoute;