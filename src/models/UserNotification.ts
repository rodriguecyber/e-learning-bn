import mongoose, { Document, Schema } from 'mongoose';

export interface IUserNotification extends Document {
  user_id: Schema.Types.ObjectId;
  title: string;
  message: string;
  notification_type: 'course_update' | 'assignment_due' | 'quiz_reminder' | 'system';
  is_read: boolean;
  created_at: Date;
  metadata: Record<string, any>;
}

const UserNotificationSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  notification_type: { type: String, enum: ['course_update', 'assignment_due', 'quiz_reminder', 'system'], required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed, default: {} }
});

export default mongoose.model<IUserNotification>('UserNotification', UserNotificationSchema);

