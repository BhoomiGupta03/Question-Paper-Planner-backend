// controllers/questionPaperController.js
import QuestionPaper from "../models/QuestionPaper.js";

// Create a new question paper
export const createQuestionPaper = async (req, res) => {
    try {
        const { subject, academicYear, year, semester, questions, bank } = req.body;
        
        // Check if user is available from auth middleware
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Create a new question paper with user ID from auth token
        const questionPaper = new QuestionPaper({
            subject,
            academicYear,
            year,
            semester,
            questions,
            bank,
            user: req.user._id // Changed from req.user.id to req.user._id
        });

        const savedQuestionPaper = await questionPaper.save();
        res.status(201).json(savedQuestionPaper);
    } catch (error) {
        console.error("Error creating question paper:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all question papers for the logged-in user
export const getAllQuestionPapers = async (req, res) => {
    try {
        // Ensure user is available
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Find papers belonging to the current user
        const questionPapers = await QuestionPaper.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // Most recent first
        
        res.status(200).json(questionPapers);
    } catch (error) {
        console.error("Error fetching question papers:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a specific question paper by ID
export const getQuestionPaperById = async (req, res) => {
    try {
        const questionPaper = await QuestionPaper.findById(req.params.id);
        
        if (!questionPaper) {
            return res.status(404).json({ message: "Question paper not found" });
        }
        
        // Ensure user is available
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Check if the question paper belongs to the current user
        if (questionPaper.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        res.status(200).json(questionPaper);
    } catch (error) {
        console.error("Error fetching question paper:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a question paper
export const deleteQuestionPaper = async (req, res) => {
    try {
        const questionPaper = await QuestionPaper.findById(req.params.id);
        
        if (!questionPaper) {
            return res.status(404).json({ message: "Question paper not found" });
        }
        
        // Ensure user is available
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Check if the question paper belongs to the current user
        if (questionPaper.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        await questionPaper.deleteOne();
        res.status(200).json({ message: "Question paper deleted successfully" });
    } catch (error) {
        console.error("Error deleting question paper:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};