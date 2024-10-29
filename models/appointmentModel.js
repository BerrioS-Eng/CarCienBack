//import dbClient from "../config/dbClient.js";
import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    service:{
        type: String,
        required: [true, "Service is required!"],
        trim: true, 
    },
    detail:{
        type: String,
        required: [true, "Description is required!"],
        trim: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required!"],
    },
    state:{
        type: String,
        enum: ["Pending", "In process", "Completed", "Cancelled"],
        default: "Pending",
    },
    appointmentDate:{
        type: Date,
        required: true,
        //Agregar validación currentDate < appointmentDate
    }
}, {
    timestamps: true
})

const model = mongoose.model("Appointment", appointmentSchema);
export const schema = model.schema;
export default model;