import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

// POST a new review
router.post('/', async (req, res) => {
  const { name, feedback } = req.body;
  const review = new Review({ name, feedback });
  const saved = await review.save();
  res.status(201).json(saved);
});

// DELETE a review
router.delete('/:id', async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  await review.deleteOne();
  res.json({ message: "Review deleted" });
});

export default router;
