import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  lesson_id: Schema.Types.ObjectId;
  title: string;
  file_url: string;
  resource_type: 'pdf' | 'doc' | 'video' | 'audio' | 'other';
  download_count: number;
  file_size: number;
}

const ResourceSchema: Schema = new Schema({
  lesson_id: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  title: { type: String, required: true },
  file_url: { type: String, required: true },
  resource_type: { type: String, enum: ['pdf', 'doc', 'video', 'audio', 'other'], required: true },
  download_count: { type: Number, default: 0 },
  file_size: { type: Number, required: true }
});

export default mongoose.model<IResource>('Resource', ResourceSchema);

