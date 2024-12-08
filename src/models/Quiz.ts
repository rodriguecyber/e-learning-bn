import mongoose, { Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
  module_id: Schema.Types.ObjectId;
  title: string;
  description: string;
  time_limit: number;
  pass_percentage: number;
  max_attempts: number;
  is_randomized: boolean;
}

const QuizSchema: Schema = new Schema({
  module_id: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: { type: String },
  time_limit: { type: Number },
  pass_percentage: { type: Number, required: true },
  max_attempts: { type: Number, default: 1 },
  is_randomized: { type: Boolean, default: false }
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);

