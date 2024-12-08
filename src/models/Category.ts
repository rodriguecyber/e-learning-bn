import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  icon: string;
  parent_id?: Schema.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  parent_id: { type: Schema.Types.ObjectId, ref: 'Category' }
});

export default mongoose.model<ICategory>('Category', CategorySchema);

