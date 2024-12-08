import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  quiz_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  answers: Record<string, string>;
  score: number;
  started_at: Date;
  completed_at?: Date;
  attempt_number: number;
}

const QuizAttemptSchema: Schema = new Schema({
  quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Schema.Types.Mixed },
  score: { type: Number },
  started_at: { type: Date, default: Date.now },
  completed_at: { type: Date },
  attempt_number: { type: Number, required: true }
});

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

