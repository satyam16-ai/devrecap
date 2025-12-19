import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

async function verifyFirebaseToken(token: string) {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
    });
    if (!response.ok) throw new Error("Invalid Auth Token");
    const data = await response.json();
    return data.users[0].localId;
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];

        let userId;
        try {
            userId = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Robust cleanup: remove whitespace AND surrounding quotes
        // Also aggressive: remove anything not alphanumeric or underscore
        const cleanKey = (key: string | undefined) => {
            if (!key) return '';
            return key.replace(/[^a-zA-Z0-9_]/g, '');
        };

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', cleanKey(process.env.RAZORPAY_KEY_SECRET))
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        await connectToDatabase();

        const transaction = await Transaction.findOne({
            razorpayOrderId: razorpay_order_id,
            userId
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
