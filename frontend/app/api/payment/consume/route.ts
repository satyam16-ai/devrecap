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

        // Find a PAID transaction that is NOT used AND matches the locked details
        // Find a PAID transaction that is NOT used
        // We removed githubUsername check to avoid case-sensitivity issues
        // If the user paid for a credit, they can use it for any username they currently view.
        const transaction = await Transaction.findOne({
            userId,
            year,
            status: 'PAID',
            usedAt: { $exists: false }
        });

        if (!transaction) {
            // Check if there is a pending transaction to give better error?
            return NextResponse.json({
                error: 'No active premium credit found for this year. Please pay first.'
            }, { status: 403 });
        }

        // Mark as USED
        transaction.status = 'USED';
        transaction.usedAt = new Date();
        await transaction.save();

        return NextResponse.json({ success: true, txId: transaction._id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
