import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  user_id: Schema.Types.ObjectId;
  lesson_id: Schema.Types.ObjectId;
  is_completed: boolean;
  time_spent: number;
  last_accessed: Date;
  notes: Record<string, any>;
}

const UserProgressSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lesson_id: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  is_completed: { type: Boolean, default: false },
  time_spent: { type: Number, default: 0 },
  last_accessed: { type: Date, default: Date.now },
  notes: { type: Schema.Types.Mixed }
});

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

