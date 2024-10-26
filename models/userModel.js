import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required!!"],
        trim: true,
        unique: [true, "Email must be unique!!"],
        minLength: [5, "Email must have 5 characters"],
        lowerCase: true,
    },
    password:{
        type: String, 
        required: [true, "Password must be provided!!"],
        trim: true,
        select: false
    },
    username:{
        type: String,
        required: [true, "Username is required!!"],
    },
    contact:{
        type: String,
        required: [true, "Contact is required!!"],
    },
    verified:{
        type: Boolean,
        default: false,
    },
    verificationCode:{
        type: String,
        default: false
    },
    verificationCodeValidation:{
        type: String,
        select: false
    },
    forgotPasswordCode:{
        type: String,
        select: false,
    },
    forgotPasswordCodeValidation:{
        type: Number,
        select: false,
    }
}, {
    timestamps: true
});


//module.exports = mongoose.model("User", userSchema);
//export default userSchema;

const model = mongoose.model("User", userSchema);
export const schema = model.schema;
export default model;