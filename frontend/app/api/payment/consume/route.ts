import { NextRequest, NextResponse } from 'next/server';
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
            return NextResponse.json({ error: 'Config Missing' }, { status: 500 });
        }

        const { githubUsername, year } = await req.json();

        if (!githubUsername || !year) {
            return NextResponse.json({ error: 'Missing consumption details' }, { status: 400 });
        }

        await connectToDatabase();

        // Find a PAID transaction that is NOT used AND matches the locked details
        const transaction = await Transaction.findOne({
            userId,
            githubUsername,
            year,
            status: 'PAID',
            usedAt: { $exists: false }
        });

        if (!transaction) {
            return NextResponse.json({
                error: 'No active premium credit found for this specific username/year.'
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
