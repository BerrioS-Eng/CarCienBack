import 'dotenv/config';

import Appointment from '../models/appointmentModel.js';

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
}