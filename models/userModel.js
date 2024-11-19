import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      trim: true,
      unique: [true, "El correo electrónico debe ser único"],
      minLength: [5, "El correo electrónico debe tener al menos 5 caracteres"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      trim: true,
      select: false,
    },
    username: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio"],
    },
    contact: {
      type: String,
      required: [true, "El contacto es obligatorio"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: false,
    },
    verificationCodeValidation: {
      type: String,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("User", userSchema);
export const schema = model.schema;
export default model;
