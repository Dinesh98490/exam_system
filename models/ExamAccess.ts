import mongoose, { Schema } from 'mongoose';


// Schema to track which users have access to which exams
// This includes start time, completion time, score, and answers given
const ExamAccessSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  grantedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiry
}, { timestamps: true });

// Prevent duplicate access entries
ExamAccessSchema.index({ userId: 1, examId: 1 }, { unique: true });

export const ExamAccess = mongoose.models.ExamAccess || mongoose.model('ExamAccess', ExamAccessSchema);
