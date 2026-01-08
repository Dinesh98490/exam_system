import mongoose, { Schema } from 'mongoose';

const ExamAccessSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  grantedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiry
}, { timestamps: true });

// Prevent duplicate access entries
ExamAccessSchema.index({ userId: 1, examId: 1 }, { unique: true });

export const ExamAccess = mongoose.models.ExamAccess || mongoose.model('ExamAccess', ExamAccessSchema);
