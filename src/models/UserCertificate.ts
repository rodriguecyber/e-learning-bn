import mongoose, { Document, Schema } from 'mongoose';

export interface IUserCertificate extends Document {
  user_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
  certificate_url: string;
  issued_date: Date;
  certificate_number: string;
  is_verified: boolean;
}

const UserCertificateSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  certificate_url: { type: String, required: true },
  issued_date: { type: Date, default: Date.now },
  certificate_number: { type: String, required: true },
  is_verified: { type: Boolean, default: true }
});

export default mongoose.model<IUserCertificate>('UserCertificate', UserCertificateSchema);

