"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, PartyPopper, Check, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function OfferPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup after 2 seconds
        const timer = setTimeout(() => {
            // Check if already seen in this session to avoid annoyance
            const seen = sessionStorage.getItem('offer_popup_seen');
            if (!seen) {
                setIsOpen(true);
                sessionStorage.setItem('offer_popup_seen', 'true');
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="relative w-full max-w-md bg-[#0f1016] border border-yellow-500/30 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-[40px] md:blur-[80px]" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-[40px] md:blur-[80px]" />

                        {/* Content */}
                        <div className="relative p-8 flex flex-col items-center text-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon */}
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <PartyPopper className="w-10 h-10 text-white fill-white/20" />
                                </div>
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-red-400 shadow-sm animate-bounce">
                                    -80% OFF
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                                Launch Offer
                            </h2>
                            <p className="text-slate-400 text-sm mb-8 px-4">
                                Celebrate our launch with exclusively discounted premium access.
                            </p>

                            {/* Price Box */}
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-center justify-between">
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Original Price</span>
                                    <span className="text-lg text-slate-400 line-through font-medium">₹49</span>
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Offer Price</span>
                                    <span className="text-3xl font-black text-white">₹10</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="w-full space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    Full Access to Premium Themes
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    4K High-Quality Downloads
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    No Watermark
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-px focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-10 transition-opacity group-hover:opacity-20" />
                                <div className="relative flex items-center justify-center gap-2 bg-black/10 backdrop-blur-sm px-8 py-3.5 text-black font-black uppercase text-sm group-hover:bg-transparent transition-colors">
                                    <Rocket className="w-4 h-4" />
                                    Claim Offer Now
                                </div>
                            </button>

                            <p className="mt-4 text-[10px] text-slate-500">
                                Limited time offer. One-time payment only.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
