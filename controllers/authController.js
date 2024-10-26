import 'dotenv/config'
import jwt from "jsonwebtoken";
import { doHash, doHashValidation, hmacProcess } from "../helpers/hashing.js";
import { acceptCodeSchema, signinSchema, signupSchema } from "../middlewares/validators.js";
//const User = require("../models/userModel");
import User from "../models/userModel.js"
import transport from '../middlewares/sendMail.js';

export async function signup(req, res) {
    const {email, password, username, contact} = req.body;
    try {
        const {error, value} = signupSchema.validate({email, password, contact});

        if(error){
            return res.status(401)
                        .json({success: false, message: error.details[0].message})
        }

        const ifUser = await User.findOne({email});

        if (ifUser) {
            return res.status(401)
                        .json({success: false, message: "User already exists!!"});
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
            username, 
            contact
        });

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success: true, message: "Your account have been created successfully!", result
        });

    } catch (error) {
        console.log(error);
    }
}

export async function signin(req, res) {
    const {email, password} = req.body;
    try {
        const {error, value} = signinSchema.validate({email, password});

        if (error) {
            return res.status(401)
                        .json({ success: false, message: error.details[0].message });
        }

        const ifUser = await User.findOne({ email }).select('+password');
        if (!ifUser) {
            return res.status(401)
                        .json({ success: false, message: 'User does exists!!'});
        }

        const result = await doHashValidation(password, ifUser.password);

        if (!result) {
            return res.status(401)
                        .json({ success: false, message: 'Invalid Credentials!!'});
        }

        const token = jwt.sign({ 
            userId: ifUser._id,
            email: ifUser.email,
            verified: ifUser.verified,
        }, 
        process.env.SECRET_KEY, 
        {
            expiresIn: '8h',
        });

        res.cookie(
            'Authorization', 
            'Bearer '+ token, 
            { 
                expires: new Date(Date.now() + 8 * 3600000), 
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            })
            .json({
                success: true,
                token,
                message: 'Logged in successfully'
            })

    } catch (error) {
        console.log(error);
    }
}

export async function signout(req, res) {
    res.clearCookie('Authorization')
        .status(200)
        .json({
            success: true,
            message: 'Logged out successfully',
        })
}


export async function sendVerificationCode(req, res) {
    const { email } = req.body
    try {
        const ifExistUser = await User.findOne({ email });
        if (!ifExistUser) {
            return res.status(401)
                        .json({ success: false, message:'User does not exists!!'});
        }

        if(ifExistUser.verified){
            return res.status(400)
                        .json({ success: false, message:'You are already verified!!'});
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: ifExistUser.email,
            subject: "Verfication code", 
            html: "<h1>" + codeValue + "</h1>"
        })
        
        if(info.accepted[0] === ifExistUser.email){
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            ifExistUser.verificationCode = hashedCodeValue;
            ifExistUser.verificationCodeValidation = Date.now();
            await ifExistUser.save()
            return res.status(200)
                        .json({
                            success: true, message: "Code sent!!"
                        });
        }
        res.status(400)
                        .json({
                            success: false, message: "Code sent failed!!"
                        });
    } catch (error) {
        console.log(error);
    }
}

export async function verifyVerificationCode(req, res) {
    const { email, providedCode } = req.body;
    
    try {
        const { error, value } = acceptCodeSchema.validate({ email, providedCode });
        if(error){
            return res.status(401)
                        .json({ success: "true", message: error.details[0].message });
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email })
                                            .select(
                                                "+verificationCode +verificationCodeValidation"
                                            );

        if(!existingUser){
            return res.status(401)
                        .json({ success: false, message: "User does not exists!!"});
        }

        if(existingUser.verified){
            return res.status(400)
                        .json({ success: "false", message: "You are already verified!!"});
        }

        if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){
            return res.status(400)
                        .json({ success: false, message: "Something is wrong with the code!!"});
        }

        if(Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000){
            return res.status(400)
                        .json({ success: false, message: "Code has been expired!!"});
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);

        if(hashedCodeValue === existingUser.verificationCode){
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200)
                        .json({ success: false, message: "Your account has been verified!!"});
        }

        return res.status(400)
                    .json({ success: false, message: "Unexpected occured!!"});

    } catch (error) {
        console.log(error)
    }
}
 