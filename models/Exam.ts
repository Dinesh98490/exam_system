import mongoose, { Schema } from 'mongoose';

// Question Schema
const QuestionSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  points: { type: Number, default: 1 },
});

export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

// Exam Schema
const ExamSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  durationMinutes: { type: Number, required: true },
  startTime: Date,
  endTime: Date,
  status: { 
    type: String, 
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
    default: 'DRAFT' 
  },
  price: { type: Number, default: 0 },
}, { timestamps: true });

export const Exam = mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
