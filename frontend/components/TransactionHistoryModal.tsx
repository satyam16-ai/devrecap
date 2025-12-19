import React, { useEffect, useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, FileText, Loader2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Transaction {
    _id: string;
    createdAt: string;
    amount: number;
    status: 'CREATED' | 'PAID' | 'FAILED' | 'USED';
    razorpayOrderId: string;
    year: number;
    provider: string;
}

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TransactionHistoryModal({ isOpen, onClose }: TransactionHistoryModalProps) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchHistory();
        }
    }, [isOpen, user]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const token = await user?.getIdToken();
            const response = await axios.get('/api/payment/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Clock className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Transaction History</h2>
                                <p className="text-sm text-gray-400">Your payments and downloads</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                <p>Loading transactions...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 gap-4">
                                <div className="p-4 rounded-full bg-white/5">
                                    <FileText className="w-8 h-8 opacity-50" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-1">No transactions yet</h3>
                                    <p className="text-sm">Your purchase history will appear here.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx._id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors gap-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-lg ${tx.status === 'PAID' || tx.status === 'USED'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : tx.status === 'FAILED'
                                                        ? 'bg-red-500/10 text-red-400'
                                                        : 'bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {tx.status === 'PAID' || tx.status === 'USED' ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : tx.status === 'FAILED' ? (
                                                    <AlertCircle className="w-5 h-5" />
                                                ) : (
                                                    <CreditCard className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-white">
                                                        Premium Card ({tx.year})
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${tx.status === 'PAID' || tx.status === 'USED'
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : tx.status === 'FAILED'
                                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    ID: {tx.razorpayOrderId}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(tx.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-4 sm:border-l border-white/10">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white">
                                                    ₹{tx.amount}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {tx.provider}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
