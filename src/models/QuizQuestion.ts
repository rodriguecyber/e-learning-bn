import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion extends Document {
  quiz_id: Schema.Types.ObjectId;
  question: string;
  options: string[];
  correct_answer: string;
  points: number;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  explanation?: string;
}

const QuizQuestionSchema: Schema = new Schema({
  quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correct_answer: { type: String, required: true },
  points: { type: Number, required: true },
  question_type: { type: String, enum: ['multiple_choice', 'true_false', 'short_answer'], required: true },
  explanation: { type: String }
});

export default mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);

