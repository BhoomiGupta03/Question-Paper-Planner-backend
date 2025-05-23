import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  feedback: { type: String, required: true }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
