import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['STUDENT', 'LECTURER', 'MODERATOR', 'ADMIN'],
    default: 'STUDENT'
  },
  isLocked: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  mfaSecret: { type: String, required: false },
  mfaEnabled: { type: Boolean, default: false },
  passwordChangedAt: { type: Date, required: false },
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
