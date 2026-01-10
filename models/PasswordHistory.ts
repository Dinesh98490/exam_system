
import mongoose, { Schema } from 'mongoose';


// Define the PasswordHistory schema
const PasswordHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite
export const PasswordHistory = mongoose.models.PasswordHistory || mongoose.model('PasswordHistory', PasswordHistorySchema);
