import 'dotenv/config';

import Appointment from '../models/appointmentModel.js';
import { createAppointmentSchema } from '../middlewares/validators.js';

export async function getAll(req, res) {
    /*
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
        */
    try{
        const result = await Appointment.find({});

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
        const existingAppointment = await Appointment.findOne({ userId: _id }).exec();
        
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

export async function updateAppointment (req, res) {
    const { _id } = req.query;
    const { service, detail, appointmentDate } = req.body;
    const { userId } = req.user;

    try {
        const { error, value } = createAppointmentSchema.validate({ service, detail, appointmentDate, userId });
        if (error) {
            return res.status(401)
                        .json({ success: false, message: error.details[0].message });
        }
        const existingAppointment = await Appointment.findOne({ _id });
        
        if (!existingAppointment) {
            return res.status(404)
                        .json({ success: false, message: "Appointment unavailable"});
        }
        if (existingAppointment.userId.toString() !== userId) {
            return res.status(403)
                        .json({ success: false, message: "Unauthorized"});
        }

        existingAppointment.service = service;
        existingAppointment.detail = detail;
        existingAppointment.appointmentDate = appointmentDate;

        const result = await existingAppointment.save();
        res.status(200).json({ success: true, message: "Update", data: result });

    } catch (error) {
        console.log(error);
    }
}

export async function deleteAppointment (req, res) {
    const { _id } = req.query;
	const { userId } = req.user;
	try {
		const existingAppointment = await Appointment.findOne({ _id });
        
		if (!existingAppointment) {
			return res.status(404)
				.json({ success: false, message: 'Appointment already unavailable' });
		}
		if (existingAppointment.userId.toString() !== userId) {
			return res.status(403)
                    .json({ success: false, message: 'Unauthorized' });
		}

		await Appointment.deleteOne({ _id });
		res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}
}