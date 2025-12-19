import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { auth } from '@/lib/firebase-admin';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate User
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];

        let userId = '';

        if (auth) {
            const decoded = await auth.verifyIdToken(token);
            userId = decoded.uid;
        } else {
            // Fallback or dev mode - BE CAREFUL
            // For now, we fail if auth not configured
            return NextResponse.json({ error: 'Server Auth Config Missing' }, { status: 500 });
        }

        const { githubUsername, year = 2024, provider } = await req.json();

        if (!githubUsername || !provider) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 2. Connect DB
        await connectToDatabase();

        // 3. Check for existing unused payment
        const existingTx = await Transaction.findOne({
            userId,
            status: { $in: ['CREATED', 'PAID'] }
        });

        if (existingTx) {
            if (existingTx.status === 'PAID') {
                return NextResponse.json({
                    error: 'You have an unused premium credit.',
                    code: 'UNUSED_CREDIT'
                }, { status: 400 });
            }
            if (existingTx.status === 'CREATED') {
                // Return existing order 
                return NextResponse.json({
                    error: 'Pending payment exists',
                    code: 'PENDING_PAYMENT',
                    orderId: existingTx.razorpayOrderId,
                    amount: existingTx.amount * 100,
                    currency: 'INR'
                }, { status: 400 });
            }
        }

        // 4. Create Order
        const amount = 10 * 100; // 10 INR
        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `rcpt_${userId.substring(0, 10)}_${Date.now()}`,
            notes: { userId, githubUsername, year }
        });

        // 5. Save Transaction
        await Transaction.create({
            userId,
            provider,
            githubUsername,
            year,
            amount: 10,
            razorpayOrderId: order.id,
            status: 'CREATED'
        });

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error('Create Order Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}
