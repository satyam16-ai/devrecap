import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

export const createCheckoutSession = async (req: Request, res: Response) => {
    const { amount = 499 } = req.body; // Default 499 INR (or cents depending on currency logic)

    const options = {
        amount: amount * 100, // Razorpay takes amount in smallest currency unit (paise)
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
};
