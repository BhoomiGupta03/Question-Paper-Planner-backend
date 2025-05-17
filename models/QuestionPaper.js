// models/QuestionPaper.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  mainQuestion: {
    type: String,
    required: true
  },
  subQuestions: {
    type: [String],
    default: []
  }
});

const questionPaperSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  bank: [String]
}, { timestamps: true });

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);

export default QuestionPaper;