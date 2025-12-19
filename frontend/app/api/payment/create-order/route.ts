import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// Robust cleanup: remove whitespace AND surrounding quotes
// Also aggressive: remove anything not alphanumeric or underscore to fix hidden char issues
const cleanKey = (key: string | undefined) => {
    if (!key) return '';
    return key.replace(/[^a-zA-Z0-9_]/g, '');
};

// Helper to verify auth token via REST API (avoids Service Account JSON complexity)
async function verifyFirebaseToken(token: string) {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
    if (!apiKey) throw new Error("Firebase API Key missing on server");

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
    });

    if (!response.ok) {
        throw new Error("Invalid Auth Token");
    }

    const data = await response.json();
    return data.users[0].localId; // The UID
}

export async function POST(req: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: cleanKey(process.env.RAZORPAY_KEY_ID),
            key_secret: cleanKey(process.env.RAZORPAY_KEY_SECRET),
        });

        // 1. Authenticate User
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];

        let userId;
        try {
            userId = await verifyFirebaseToken(token);
        } catch (e) {
            console.error("Auth Failed:", e);
            return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
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
            key: cleanKey(process.env.RAZORPAY_KEY_ID)
        });

    } catch (error: any) {
        console.error('Create Order Error:', error);

        // Handle Razorpay errors 
        let errorMessage = 'Internal Error';
        let razorpayError = null;

        if (error && typeof error === 'object') {
            if (error.statusCode && error.error) {
                // Razorpay API error
                razorpayError = {
                    statusCode: error.statusCode,
                    description: error.error.description || error.error,
                    code: error.error.code
                };
                errorMessage = `Razorpay Error: ${error.error.description || JSON.stringify(error.error)}`;
            } else if (error.message) {
                errorMessage = error.message;
            }
        }

        const rawId = process.env.RAZORPAY_KEY_ID;
        const rawSecret = process.env.RAZORPAY_KEY_SECRET;

        const debugInfo = {
            type: error?.constructor?.name,
            message: error?.message,
            razorpayError,
            env: {
                hasRazorpayId: !!rawId,
                idRawLength: rawId?.length,
                idCleanedLength: cleanKey(rawId).length,
                idCleanedValuePreview: cleanKey(rawId).substring(0, 5) + '...', // Check prefix
                secretRawLength: rawSecret?.length,
                secretCleanedLength: cleanKey(rawSecret).length,
                idEndChar: rawId ? JSON.stringify(rawId.slice(-1)) : null
            }
        };

        return NextResponse.json({ error: errorMessage, debug: debugInfo }, { status: 500 });
    }
}
