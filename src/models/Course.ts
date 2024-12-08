import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  instructor_id: Schema.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  prerequisites: string[];
  start_date: Date;
  end_date: Date;
  is_certified: boolean;
  duration_weeks: number;
}

const CourseSchema: Schema = new Schema({
  instructor_id: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  difficulty_level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  prerequisites: [{ type: String }],
  start_date: { type: Date },
  end_date: { type: Date },
  is_certified: { type: Boolean, default: false },
  duration_weeks: { type: Number }
});

export default mongoose.model<ICourse>('Course', CourseSchema);

