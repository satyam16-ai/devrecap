# Payment System Setup Guide

This document outlines how to configure the newly implemented Razorpay + MongoDB payment system for premium cards.

## 1. Environment Variables

You must add the following variables to your `.env.local` (local) and Vercel (production).

### MongoDB
1. Create a MongoDB Atlas cluster.
2. Get the connection string (Driver: Node.js).
3. Replace `<password>` with your database user password.
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devrecap?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devrecap?retryWrites=true&w=majority
```
4. **Network Access**: In MongoDB Atlas -> Network Access -> Add IP Address -> **Allow Access from Anywhere (0.0.0.0/0)**. This is required for Vercel.

### Razorpay
1. Log in to Razorpay Dashboard.
2. Go to Settings -> API Keys.
3. Generate Key ID and Secret.
```env
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...  # Same as KEY_ID
```
*Note: Use Test Mode keys for development.*

### Firebase Auth Verification
The backend now uses the Google Identity Toolkit REST API to verify tokens.
- **Requirement**: `NEXT_PUBLIC_FIREBASE_API_KEY` (Already part of Frontend `.env.local`).
- **No Service Account JSON required.**

## 2. Testing the Flow

1. **Login** to the app.
2. Go to Dashboard.
3. Enable "Premium" toggle or change Theme/Font to a premium one.
4. Click "Download Premium Card".
5. **Payment Modal** should appear.
6. Click "Pay ₹10".
7. Complete payment (use Razorpay Test Card details if in test mode).
   - Card: `Success` flow
   - UPI: `Success` flow
8. Upon success, the modal will close and the download will start automatically.
9. Check MongoDB: A new document in `transactions` collection should exist with `status: "USED"`.

## 3. Important Notes

- **One-Time Use**: The system strictly enforces one download per payment. Once a card is downloaded, the transaction is marked `USED`. To download again, a new payment is required (as per requirements).
- **Unused Credits**: If a payment succeeds but download fails (network error), the transaction remains `PAID` but not `USED`. Next time you click "Download", it will detect the credit and allow download without paying again.
