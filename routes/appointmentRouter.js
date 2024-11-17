import express from "express";
import { identifier } from "../middlewares/identification.js";
import {
  getAll,
  create,
  getOne,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const appointmentRoute = express.Router();

appointmentRoute.get("/all", getAll);

appointmentRoute.get("/single-post", getOne);

//appointmentRoute.post("/create", identifier, create);
appointmentRoute.post("/create", create);

appointmentRoute.put("/update", identifier, updateAppointment);

appointmentRoute.delete("/delete", identifier, deleteAppointment);

export default appointmentRoute;
