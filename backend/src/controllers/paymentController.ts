import { Request, Response } from 'express';
import crypto from 'crypto';
import razorpay from '../config/razorpay';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

// 1. Create Order
export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user.uid;
        const { githubUsername, year = 2024, provider } = req.body;

        if (!githubUsername || !provider) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        // Check for existing unused transaction
        const existingTx = await Transaction.findOne({
            userId,
            status: { $in: ['CREATED', 'PAID'] }
        });

        if (existingTx) {
            if (existingTx.status === 'PAID') {
                res.status(400).json({
                    error: "You have an unused premium credit.",
                    code: "UNUSED_CREDIT",
                    transactionId: existingTx._id
                });
                return;
            }
            if (existingTx.status === 'CREATED') {
                // Resume existing order
                res.json({
                    id: existingTx.razorpayOrderId,
                    currency: "INR",
                    amount: existingTx.amount * 100,
                    userId,
                    resumed: true
                });
                return;
            }
        }

        const amount = 10 * 100; // 10 INR in paise
        const currency = "INR";

        const options = {
            amount,
            currency,
            receipt: `rcpt_${userId.substring(0, 10)}_${Date.now()}`,
            notes: {
                userId,
                githubUsername,
                year
            }
        };

        const order = await razorpay.orders.create(options);

        // Create Transaction Record
        const newTx = new Transaction({
            userId,
            provider,
            githubUsername,
            year,
            amount: 10,
            razorpayOrderId: order.id,
            status: 'CREATED'
        });

        await newTx.save();

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            userId
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Failed to create payment order" });
    }
};

// ... verifyPayment stays same ...

// 4. Consume Payment (Generate Card)
export const consumePayment = async (req: Request, res: Response) => {
    try {
        const userId = req.user.uid;

        // Find the latest successful transaction
        const transaction = await Transaction.findOne({
            userId,
            status: { $in: ['PAID', 'USED'] }
        }).sort({ createdAt: -1 });

        if (!transaction) {
            res.status(403).json({ error: "No active premium credit found. Please pay first." });
            return;
        }

        // Logic:
        // 1. If PAID, mark USED and allow.
        // 2. If USED, check if within Retry Window (e.g., 20 mins).

        const RETRY_WINDOW_MS = 20 * 60 * 1000; // 20 Minutes

        if (transaction.status === 'USED') {
            const timeSinceUsed = transaction.usedAt ? (Date.now() - new Date(transaction.usedAt).getTime()) : RETRY_WINDOW_MS + 1;

            if (timeSinceUsed > RETRY_WINDOW_MS) {
                res.status(403).json({
                    error: "Premium credit already used.",
                    code: "CREDIT_EXPIRED"
                });
                return;
            }
            // Within window, allow retry
            // console.log("Allowing retry for tx:", transaction._id);
        } else {
            // Mark as USED (First time)
            transaction.status = 'USED';
            transaction.usedAt = new Date();
            await transaction.save();
        }

        res.json({ success: true, message: "Download authorized", txId: transaction._id });

    } catch (error) {
        res.status(500).json({ error: "Failed to process premium request" });
    }
};
