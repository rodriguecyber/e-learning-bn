import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
  course_id: Schema.Types.ObjectId;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  duration_hours: number;
}

const ModuleSchema: Schema = new Schema({
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  order_index: { type: Number, required: true },
  is_published: { type: Boolean, default: false },
  duration_hours: { type: Number }
});

export default mongoose.model<IModule>('Module', ModuleSchema);

