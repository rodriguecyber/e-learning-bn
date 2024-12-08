import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  role: 'student' | 'instructor' | 'admin';
  profile_picture?: string;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
  preferences: Record<string, any>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  is_active: { type: Boolean, default: true },
  preferences: { type: Schema.Types.Mixed, default: {} }
});

export default mongoose.model<IUser>('User', UserSchema);

