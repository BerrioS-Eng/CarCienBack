import appointmentModel from '../models/appointmentModel.js';

class AppointmentController {
    constructor(){

    }

    async create(req, res) {
        try {
            const data = await appointmentModel.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).send(e);
        }
    }

    async update(req, res) {
        try {
            res.status(201).json({status: 'update-OK'});
        } catch (error) {
            res.status(500).send(e);
        }
    }

    async delete(req, res) {
        try {
            res.status(201).json({status: 'delete-OK'});
        } catch (error) {
            res.status(500).send(e);
        }
    }

    async getAll(req, res) {
        try {
            res.status(201).json({status: 'getAll-OK'});
        } catch (error) {
            res.status(500).send(e);
        }
    }

    async getOne(req, res) {
        try {
            res.status(201).json({status: 'getOne-OK'});
        } catch (error) {
            res.status(500).send(e);
        }
    }
}

export default new AppointmentController();