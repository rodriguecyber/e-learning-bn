import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  module_id: Schema.Types.ObjectId;
  title: string;
  content: string;
  content_type: 'text' | 'video' | 'audio';
  video_url?: string;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
}

const LessonSchema: Schema = new Schema({
  module_id: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  content_type: { type: String, enum: ['text', 'video', 'audio'], required: true },
  video_url: { type: String },
  duration_minutes: { type: Number },
  order_index: { type: Number, required: true },
  is_free_preview: { type: Boolean, default: false }
});

export default mongoose.model<ILesson>('Lesson', LessonSchema);

