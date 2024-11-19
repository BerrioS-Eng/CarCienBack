import "dotenv/config";
import Appointment from "../models/appointmentModel.js";
import { createAppointmentSchema } from "../middlewares/validators.js";

export async function getAll(req, res) {
  try {
    const result = await Appointment.find({});
    res.status(200).json({
      success: true,
      message: "Citas recuperadas exitosamente",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar las citas" });
  }
}

export async function create(req, res) {
  const { nombre, correo, contacto, vehiculo, mensaje } = req.body;

  try {
    const { error, value } = createAppointmentSchema.validate({
      nombre,
      correo,
      contacto,
      vehiculo,
      mensaje,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const newAppointment = new Appointment({
      nombre,
      correo,
      contacto,
      vehiculo,
      mensaje,
    });

    const result = await newAppointment.save();
    res.status(201).json({
      success: true,
      message: "Cita creada exitosamente",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al crear la cita" });
  }
}

export async function getOne(req, res) {
  const { _id } = req.params;

  try {
    const appointment = await Appointment.findById(_id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Cita no encontrada" });
    }

    res.status(200).json({
      success: true,
      message: "Cita recuperada exitosamente",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al recuperar la cita" });
  }
}

export async function updateAppointment(req, res) {
  const { _id } = req.params;
  const { nombre, correo, contacto, vehiculo, mensaje } = req.body;

  try {
    const { error, value } = createAppointmentSchema.validate({
      nombre,
      correo,
      contacto,
      vehiculo,
      mensaje,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const appointment = await Appointment.findById(_id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada",
      });
    }

    appointment.nombre = nombre;
    appointment.correo = correo;
    appointment.contacto = contacto;
    appointment.vehiculo = vehiculo;
    appointment.mensaje = mensaje;

    const result = await appointment.save();
    res.status(200).json({
      success: true,
      message: "Cita actualizada exitosamente",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar la cita" });
  }
}

export async function deleteAppointment(req, res) {
  const { _id } = req.params;

  try {
    const appointment = await Appointment.findById(_id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Cita no encontrada" });
    }

    await appointment.remove();
    res
      .status(200)
      .json({ success: true, message: "Cita eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la cita" });
  }
}
