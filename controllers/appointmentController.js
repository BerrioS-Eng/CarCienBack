import 'dotenv/config';

import Appointment from '../models/appointmentModel.js';
import { createAppointmentSchema } from '../middlewares/validators.js';

export async function getAll(req, res) {
    const { page } = req.query;
    const appointmentPerPage = 10;

    try {
        let pageNum = 0;
        if (page <= 1) {
            pageNum = 0
        } else {
            pageNum = page - 1;
        }

        const result = await Appointment.find()
                                            .sort({ createdAt: -1 })
                                            .skip(pageNum * appointmentPerPage)
                                            .limit(appointmentPerPage)
                                            .populate({ path: "UserId", select: "email" });

        res.status(200).json({ success: true, message: "Appointment", data: result });
    } catch (error) {
        console.log(error);
    }
};

export async function create(req, res) {
    const { service, detail, appointmentDate } = req.body;
    const { userId } = req.user;

    try {
        const { error, value } = createAppointmentSchema.validate({ service, detail, appointmentDate, userId });

        if (error) {
            return res.status(401)
                        .json({ success: false, message: error.details[0].message });
        }

        const result = await Appointment.create({
            service, detail, appointmentDate, userId
        })

        res.status(200).json({ success: true, message: "create", data: result })

    } catch (error) {
        console.log(error);
    }
};

export async function getOne(req, res) {
    const { _id } = req.query;

    try {
        const existingAppointment = await Appointment.findOne({ _id }).populate({
            path: "UserId",
            select: "email"
        })

        if (!existingAppointment) {
            return res.status(404)
                        .json({ success: false, message: "Appointment unavailable"});
        }

        res.status(200)
            .json({ success: true, message: "Single appointment", data: existingAppointment })

    } catch (error) {
        console.log(error);
    }
};

