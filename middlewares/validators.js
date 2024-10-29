import Joi from "joi";

export const signupSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds:{
                allow: ["com", "net"] 
            },
    }),
    password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
    contact: Joi.string()
    .required(),
})

export const signinSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds:{
                allow: ["com", "net"] 
            },
    }),
    password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
})

export const acceptCodeSchema = Joi.object({
    email: Joi.string()
            .min(6)
            .max(60)
            .required()
            .email({
                tlds: { allow: ["com", "net"] },
            }),
    providedCode: Joi.number()
})

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
                        .required(),
    newPassword: Joi.string()
                        .required()
})

export const createAppointmentSchema = Joi.object({
    service: Joi.string()
                    .required(),
    detail: Joi.string()
                    .required(),
    appointmentDate: Joi.date()
                            .required(),
    userId: Joi.string()
                    .required()
})