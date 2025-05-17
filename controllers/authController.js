import User from "../models/User.js";

export const signup = async (req, res) => {
    const { teacherName, email, password } = req.body;
    try {
        const user = await User.create({ teacherName, email, password });
        res.status(201).json({ user, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt for:", email);
        
        // Find user by email
        
const user = await User.findOne({ email });
if (!user) {
    console.log(`No user found with email: ${email}`);
    return res.status(400).json({ message: "User not found" });
}
        
        // Check if password is correct
        console.log("User found, checking password");
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            console.log("Password incorrect for:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Generate access token
        console.log("Password correct, generating token");
        const accessToken = user.generateAccessToken();
        
        // Set cookie options
        const cookieOption = {
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            httpOnly: true, // Prevent XSS attacks
            sameSite: "strict", // Fixed typo here
            secure: process.env.NODE_ENV === "production"
        };
        
        // Set cookie and send response
        console.log("Sending response with token");
        res.cookie("accessToken", accessToken, cookieOption);
        res.json({
            teacherName: user.teacherName,
            email: user.email,
            accessToken: accessToken
        });
        
        
        // Save token to user - do this after sending response to avoid delays
        user.accessToken = accessToken;
        await user.save();
    } catch (error) {
        console.error("Login error details:", error);
        res.status(500).json({ message: error.message });
    }
};