import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  user_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
  enrolled_at: Date;
  status: 'active' | 'completed' | 'dropped';
  completion_date?: Date;
  progress_percentage: number;
}

const EnrollmentSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolled_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  completion_date: { type: Date },
  progress_percentage: { type: Number, default: 0 }
});

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

