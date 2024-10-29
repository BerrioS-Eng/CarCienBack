import 'dotenv/config'
import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from './routes/authRouter.js';
import appointmentRoute from './routes/appointmentRouter.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//app.use('/app', routesAppointment);
app.use('/api/auth', authRoutes);
app.use('/api/appointment', appointmentRoute)
//app.use('/appointment', routesAppointment);
//app.use('/user', routesUser);
//app.use('/product', routesProduct);

try {
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log("Servidor activo en el puerto " + PORT));
} catch (error) {
    console.log(e);
}

mongoose.connect(process.env.MONGO_URI).then(()=> {
    console.log("Database connected!")
}).catch(err => {
    console.log(err)
});