import express from "express";
import { identifier } from "../middlewares/identification.js";
import { 
    signup, 
    signin, 
    signout, 
    sendVerificationCode, 
    verifyVerificationCode
} from '../controllers/authController.js';

const authRoute = express.Router();

authRoute.post('/signup', signup);
authRoute.post('/signin', signin);
authRoute.post('/signout', identifier, signout);

authRoute.patch('/send-verification-code', identifier, sendVerificationCode);
authRoute.patch('/verify-verification-code', identifier, verifyVerificationCode);

export default authRoute;

