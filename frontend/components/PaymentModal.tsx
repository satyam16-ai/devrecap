"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, Sparkles, Receipt } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Called when payment is done or credit confirmed
    githubUsername: string;
    year: number;
    provider: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentModal({ isOpen, onClose, onSuccess, githubUsername, year, provider }: PaymentModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        if (!user) return;
        setLoading(true);
        setError('');

        try {
            const token = await user.getIdToken();

            // 1. Create Order
            const { data } = await axios.post('/api/payment/create-order', {
                githubUsername,
                year,
                provider
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => {
                // If 400 and UNUSED_CREDIT, we treat as success immediately
                if (err.response?.data?.code === 'UNUSED_CREDIT') {
                    return { data: { unusedCredit: true } };
                }
                // If PENDING_PAYMENT, we assume we want to resume it (data contains orderId)
                if (err.response?.data?.code === 'PENDING_PAYMENT') {
                    return {
                        data: {
                            ...err.response.data, // Contains orderId, amount, etc
                            resume: true
                        }
                    };
                }
                throw err;
            });

            if (data.unusedCredit) {
                // User already paid!
                onSuccess();
                onClose();
                return;
            }

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE', // Fallback for safety
                amount: data.amount,
                currency: data.currency,
                name: "DevRecap Premium",
                description: "Premium Card Transaction",
                order_id: data.resume ? data.orderId : data.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await axios.post('/api/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        // Payment Verified!
                        onSuccess();
                        onClose();
                    } catch (verifyErr) {
                        console.error(verifyErr);
                        setError("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.displayName,
                    email: user.email,
                },
                theme: {
                    color: "#3B82F6"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(response.error.description || "Payment Failed");
            });
            rzp.open();

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-md w-full relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Unlock Premium</h2>

                            {/* Offer Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs font-bold text-yellow-500 uppercase tracking-wider mb-4">
                                <Sparkles className="w-3 h-3" /> Launch Offer
                            </div>

                            <p className="text-slate-400 mb-6 text-sm">
                                Get high-quality downloads, remove watermarks, and access all premium themes.
                            </p>

                            {/* Price Breakdown */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="text-slate-500 line-through text-lg">₹49</div>
                                <div className="text-4xl font-black text-white">₹10</div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 text-left">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Pay ₹10 & Download</span>
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs line-through opacity-70">₹49</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <ShieldIcon className="w-3 h-3" />
                                    Secure Payment via Razorpay
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-slate-950 p-4 border-t border-slate-800 text-center">
                            <p className="text-xs text-slate-500">
                                One-time payment. No subscription.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ShieldIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
