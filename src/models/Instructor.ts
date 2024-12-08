import mongoose, { Document, Schema } from 'mongoose';

export interface IInstructor extends Document {
  user_id: Schema.Types.ObjectId;
  bio: string;
  expertise: string[];
  rating: number;
  total_students: number;
  social_links: Record<string, string>;
}

const InstructorSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  expertise: [{ type: String }],
  rating: { type: Number, default: 0 },
  total_students: { type: Number, default: 0 },
  social_links: { type: Schema.Types.Mixed, default: {} }
});

export default mongoose.model<IInstructor>('Instructor', InstructorSchema);

