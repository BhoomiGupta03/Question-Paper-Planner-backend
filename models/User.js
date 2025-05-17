import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    accessToken: { type: String },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to check if password is correct  
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error("ACCESS_TOKEN_SECRET is not defined in environment variables");
            throw new Error("JWT secret is not configured");
        }
        
        return jwt.sign(
            { _id: this._id, email: this.email },
            process.env.ACCESS_TOKEN_SECRET,
            { 
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '2d' // Default to 2 days if not specified
            }
        );
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};

export default mongoose.model("User", userSchema);