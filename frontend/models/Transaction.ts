import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITransaction extends Document {
    userId: string;
    provider: string;
    githubUsername: string;
    year: number;
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    status: 'CREATED' | 'PAID' | 'USED' | 'FAILED';
    createdAt: Date;
    usedAt?: Date;
}

const TransactionSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    githubUsername: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true, default: 10 },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    status: {
        type: String,
        enum: ['CREATED', 'PAID', 'USED', 'FAILED'],
        default: 'CREATED'
    },
    createdAt: { type: Date, default: Date.now },
    usedAt: { type: Date }
});

TransactionSchema.index({ userId: 1, status: 1 });

// Prevent overwrite on hot reload
const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
