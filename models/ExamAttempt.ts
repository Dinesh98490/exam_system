import mongoose, { Schema } from 'mongoose';

const ExamAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  startTime: { type: Date, default: Date.now },
  completedAt: { type: Date },
  score: { type: Number },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, required: true },
    selectedOptionIndex: { type: Number, required: true }
  }],
}, { timestamps: true });

export const ExamAttempt = mongoose.models.ExamAttempt || mongoose.model('ExamAttempt', ExamAttemptSchema);
