// routes/questionPaperRoutes.js
import express from 'express';
import QuestionPaper from '../models/QuestionPaper.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all question papers for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const questionPapers = await QuestionPaper.find({ user: req.user._id });
    res.json(questionPapers);
  } catch (err) {
    console.error('Error fetching question papers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get a specific question paper
router.get('/:id', protect, async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!questionPaper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    
    res.json(questionPaper);
  } catch (err) {
    console.error('Error fetching question paper:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new question paper
router.post('/', protect, async (req, res) => {
  try {
    const { subject, academicYear, year, semester, questions, bank } = req.body;
    const userId = req.user._id;
    
    const newPaper = new QuestionPaper({
      user: userId,
      subject,
      academicYear,
      year,
      semester,
      questions,
      bank,
    });

    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    console.error("Error saving question paper:", error);
    res.status(500).json({ error: "Failed to save question paper" });
  }
});

// Update a question paper
router.put('/:id', protect, async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!questionPaper) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    
    const { subject, academicYear, year, semester, questions, bank } = req.body;
    
    if (subject) questionPaper.subject = subject;
    if (academicYear) questionPaper.academicYear = academicYear;
    if (year) questionPaper.year = year;
    if (semester) questionPaper.semester = semester;
    if (questions) questionPaper.questions = questions;
    if (bank) questionPaper.bank = bank;
    
    const updatedQuestionPaper = await questionPaper.save();
    res.json(updatedQuestionPaper);
  } catch (err) {
    console.error('Error updating question paper:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a question paper
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log(  req.params.id
      )
      const questionPaper = await QuestionPaper.findById(req.params.id);

    
    if (!questionPaper) {
      console.log("No matching paper found for id", req.params.id, "and user", req.user._id);
      return res.status(404).json({ message: 'Question paper not found' });
    }    
    
    await QuestionPaper.deleteOne({ _id: req.params.id }); // <-- use this instead of remove()
    res.json({ message: 'Question paper removed' });
  } catch (err) {
    console.error('Error deleting question paper:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;