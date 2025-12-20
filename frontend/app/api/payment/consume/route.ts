import { NextRequest, NextResponse } from 'next/server';
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

        const { githubUsername, year } = await req.json();

        if (!githubUsername || !year) {
            return NextResponse.json({ error: 'Missing consumption details' }, { status: 400 });
        }

        await connectToDatabase();

        // Find a transaction that is PAID or USED (for retry)
        const transaction = await Transaction.findOne({
            userId,
            githubUsername,
            year,
            status: { $in: ['PAID', 'USED'] }
        }).sort({ createdAt: -1 });

        if (!transaction) {
            return NextResponse.json({
                error: 'No active premium credit found for this specific username/year.'
            }, { status: 403 });
        }

        // Retry Logic
        if (transaction.status === 'USED') {
            const RETRY_WINDOW = 20 * 60 * 1000; // 20 Minutes
            const timeSince = transaction.usedAt ? Date.now() - new Date(transaction.usedAt).getTime() : RETRY_WINDOW + 1;

            if (timeSince > RETRY_WINDOW) {
                return NextResponse.json({
                    error: 'Premium credit expired. Please pay again.'
                }, { status: 403 });
            }
        } else {
            // First time mark as used
            transaction.status = 'USED';
            transaction.usedAt = new Date();
            await transaction.save();
        }

        return NextResponse.json({ success: true, txId: transaction._id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
