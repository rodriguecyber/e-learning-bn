import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentHistory extends Document {
  user_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  payment_date: Date;
  payment_details: Record<string, any>;
}

const PaymentHistorySchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], required: true },
  transaction_id: { type: String, required: true },
  payment_date: { type: Date, default: Date.now },
  payment_details: { type: Schema.Types.Mixed, default: {} }
});

export default mongoose.model<IPaymentHistory>('PaymentHistory', PaymentHistorySchema);

