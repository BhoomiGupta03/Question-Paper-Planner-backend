// routes/profileRoutes.js
import express from 'express';
import User from '../models/User.js';
import QuestionPaper from '../models/QuestionPaper.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
   
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', protect, async (req, res) => {
  const { teacherName, bio } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (teacherName) user.teacherName = teacherName;
    if (bio !== undefined) user.bio = bio;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      teacherName: updatedUser.teacherName,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all question papers for a user
router.get('/question-papers', protect, async (req, res) => {
  try {
    const questionPapers = await QuestionPaper.find({ user: req.user._id });
    res.json(questionPapers);
  } catch (err) {
    console.error('Error fetching question papers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;