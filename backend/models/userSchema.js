import crypto from "crypto"; // 👈 Also import at top
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { validate } from "node-cron";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:[3, "Name Must Contain At Least Three Characters."],
        maxLength:[30, "Nmae can not exceed 30 characters."]
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide a Valid E-mail."]
    },
    phone:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    niches:{
        firstNiche: String,
        secondNiche: String,
        thirdNiche: String,
    },
    password:{
        type: String,
        required: true,
        minLength:[8, "Password Must Contain At Least Eight Charactres."],
        maxLength:[32, "Password can not exceed 32 characters."],
        select: false
    },
    resume:{
        public_id: String,
        url: String
    },
    coverLetter:{
        type: String
    },
    role:{
        type: String,
        required: true,
        enum: ["Job Seeker", "Employer"]
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE,
    });    
};


userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
};


export const User = mongoose.model("User", userSchema)