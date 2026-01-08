import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  amount: { type: Number, required: true },
  provider: { type: String, enum: ['ESEWA', 'KHALTI'], default: 'ESEWA' },
  transactionId: { type: String, unique: true, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], 
    default: 'PENDING'
  },
  metadata: { type: Map, of: String }
}, { timestamps: true });

// Prevent model overwrite
export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
