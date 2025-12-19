import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// Helper to verify auth token via REST API
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

export async function GET(req: NextRequest) {
    try {
        // 1. Authenticate User
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];

        let userId;
        try {
            userId = await verifyFirebaseToken(token);
        } catch {
            return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
        }

        // 2. Connect DB & Fetch
        await connectToDatabase();

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .select('amount status createdAt razorpayOrderId provider year githubUsername')
            .lean();

        return NextResponse.json({ transactions });

    } catch (error: any) {
        console.error('History API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
