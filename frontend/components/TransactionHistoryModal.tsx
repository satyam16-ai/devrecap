import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, CheckCircle2, AlertCircle, FileText, Loader2, CreditCard, ChevronRight, Download } from 'lucide-react';
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen && user) {
            fetchHistory();
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
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

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0B0F17] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                                    <Clock className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Purchase History</h2>
                                    <p className="text-sm text-slate-400">Track your premium downloads and payments</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4 bg-[#0B0F17]">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
                                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                    <p className="font-medium animate-pulse">Retrieving records...</p>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-slate-900/50 flex items-center justify-center border border-dashed border-slate-700">
                                        <FileText className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">No purchases found</h3>
                                        <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                            You haven't purchased any premium cards yet. Your history will appear here once you do.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                transactions.map((tx) => (
                                    <div
                                        key={tx._id}
                                        className="group relative overflow-hidden bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-blue-500/30 rounded-2xl p-4 transition-all duration-300"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                            {/* Status Icon & Info */}
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 p-2.5 rounded-xl border backdrop-blur-md shadow-lg ${tx.status === 'PAID' || tx.status === 'USED'
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                        : tx.status === 'FAILED'
                                                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                    }`}>
                                                    {tx.status === 'PAID' || tx.status === 'USED' ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : tx.status === 'FAILED' ? (
                                                        <AlertCircle className="w-5 h-5" />
                                                    ) : (
                                                        <CreditCard className="w-5 h-5" />
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-semibold text-white">
                                                            Premium {tx.provider === 'leetcode' ? 'LeetCode' : 'GitHub'} Card
                                                        </h3>
                                                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                                            {tx.year}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                                                        <span>{new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                        <span className="truncate max-w-[120px] opacity-70">#{tx.razorpayOrderId}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Amount & Badge */}
                                            <div className="flex items-center justify-between sm:justify-end gap-5 pl-2 sm:pl-6 sm:border-l border-white/5 min-w-[140px]">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-white tracking-tight">₹{tx.amount}</div>
                                                    <div className={`text-[10px] font-bold uppercase tracking-wider ${tx.status === 'PAID' || tx.status === 'USED' ? 'text-emerald-500' :
                                                            tx.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'
                                                        }`}>
                                                        {tx.status === 'USED' ? 'Redeemed' : tx.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Bar Decoration */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${tx.status === 'PAID' || tx.status === 'USED' ? 'bg-gradient-to-b from-emerald-500 to-teal-500' :
                                                tx.status === 'FAILED' ? 'bg-gradient-to-b from-red-500 to-pink-500' : 'bg-gradient-to-b from-amber-500 to-yellow-500'
                                            }`} />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-950 border-t border-white/5 text-center">
                            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                                Issues with a transaction? <a href="#report-issue" className="text-blue-400 hover:text-blue-300 transition underline underline-offset-2">Contact Support</a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
