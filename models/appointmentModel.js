import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Nombre es requerido!"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "Correo es requerido!"],
      trim: true,
    },
    contacto: {
      type: String,
      required: [true, "Número de contacto es requerido!"],
      trim: true,
    },
    vehiculo: {
      type: String,
      required: [true, "Marca y modelo del vehículo son requeridos!"],
      trim: true,
    },
    mensaje: {
      type: String,
      required: [true, "Mensaje es requerido!"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("Appointment", appointmentSchema);
export const schema = model.schema;
export default model;
