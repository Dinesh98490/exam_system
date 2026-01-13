
import mongoose, { Schema } from 'mongoose';


// Define the ActivityLog schema
// This schema tracks user activities such as logins, resource accesses, and other actions
const ActivityLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  resource: { type: String, required: false },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent model overwrite
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
