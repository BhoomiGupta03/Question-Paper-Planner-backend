import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import questionPaperRoutes from "./routes/questionPaperRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"; 
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questionpapers", questionPaperRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));