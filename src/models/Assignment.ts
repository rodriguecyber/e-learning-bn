import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  module_id: Schema.Types.ObjectId;
  title: string;
  description: string;
  due_date: Date;
  max_points: number;
  rubric: Record<string, any>;
  requires_file: boolean;
}

const AssignmentSchema: Schema = new Schema({
  module_id: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  max_points: { type: Number, required: true },
  rubric: { type: Schema.Types.Mixed },
  requires_file: { type: Boolean, default: false }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

