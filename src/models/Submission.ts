import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  assignment_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  submitted_at: Date;
  status: 'pending' | 'graded' | 'late';
}

const SubmissionSchema: Schema = new Schema({
  assignment_id: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  file_url: { type: String },
  score: { type: Number },
  feedback: { type: String },
  submitted_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'graded', 'late'], default: 'pending' }
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);

