import mongoose, { Document, Schema } from 'mongoose';

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

// Compound index to ensure unique unused payment per user/username/year
// But we actually only want to allow ONE unused payment globally for that user at a time?
// The requirement says: "A user can only generate/download one premium card per successful payment, at a time."
// "If an unused payment exists -> block"
// So we just need to query efficiently.
TransactionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
