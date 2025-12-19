import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { auth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
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
            return NextResponse.json({ error: 'Server Auth Config Missing' }, { status: 500 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        await connectToDatabase();

        const transaction = await Transaction.findOne({
            razorpayOrderId: razorpay_order_id,
            userId // Verify userId matches
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (isValid) {
            transaction.status = 'PAID';
            transaction.razorpayPaymentId = razorpay_payment_id;
            await transaction.save();
            return NextResponse.json({ success: true, status: 'PAID' });
        } else {
            transaction.status = 'FAILED';
            await transaction.save();
            return NextResponse.json({ error: 'Invalid Signature', status: 'FAILED' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Verify Payment Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
