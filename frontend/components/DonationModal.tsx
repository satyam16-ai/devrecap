"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Download, ExternalLink, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import qrPayment from './qr-payment.jpg';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => void;
}

export default function DonationModal({ isOpen, onClose, onDownload }: DonationModalProps) {
    const [countdown, setCountdown] = useState(10);
    const [hasDownloaded, setHasDownloaded] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCountdown(10);
            setHasDownloaded(false);
            return;
        }

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (!hasDownloaded) {
            // Auto download after countdown, but DON'T close modal
            onDownload();
            setHasDownloaded(true);
        }
    }, [isOpen, countdown, onDownload, hasDownloaded]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        {/* Content */}
                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3">
                                    <Heart className="w-6 h-6 text-white fill-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                                    Support Our Mission
                                </h2>
                                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-sm">
                                    Your download will start in <span className="text-blue-400 font-bold text-lg">{countdown}</span> seconds
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap justify-center gap-3 mb-6">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                                    <Shield className="w-3.5 h-3.5 text-green-400" />
                                    <span className="text-xs text-green-300">100% Safe & Secure</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    <Users className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-xs text-blue-300">From Our Team</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Mission Statement */}
                                <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 h-full flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <span className="text-xl">🎯</span> Our Promise to You
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed mb-4 text-sm">
                                        We're building a <strong className="text-white">free AI/ML learning platform</strong> where students can learn from scratch. Your support helps us create:
                                    </p>
                                    <ul className="space-y-2 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">✓</span>
                                            <span>High-quality tech tutorials</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-white mt-0.5">✓</span>
                                            <span>Interactive visualizations</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">✓</span>
                                            <span>Open-source developer tools</span>
                                        </li>
                                    </ul>

                                    <a
                                        href="https://aimllearnhub.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition-colors font-semibold text-sm"
                                    >
                                        Check out our AI/ML platform demo <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                {/* UPI QR Code Section */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 h-full flex flex-col justify-center">
                                    <h3 className="text-base font-bold text-white mb-3 text-center">
                                        💝 Support with UPI (Optional)
                                    </h3>
                                    <div className="flex flex-col items-center gap-3">
                                        {/* QR Code */}
                                        <div className="bg-white p-3 rounded-xl shadow-lg">
                                            <div className="w-40 h-40 relative overflow-hidden rounded-lg">
                                                <Image
                                                    src={qrPayment}
                                                    alt="UPI QR Code"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-xs text-center">
                                            Scan with any UPI app • Even ₹10 helps! 🙏
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Transparency Note */}
                            <div className="bg-slate-800/30 rounded-xl p-4 mb-6 border border-slate-700/50">
                                <p className="text-slate-400 text-sm leading-relaxed text-center">
                                    <strong className="text-slate-300">This is NOT a scam.</strong> We're a team of educators passionate about making tech education accessible. Every contribution helps us dedicate more time to building incredible learning experiences. Thank you for your trust! ❤️
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => {
                                        onDownload();
                                        setCountdown(0);
                                        setHasDownloaded(true);
                                    }}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Now (Skip Timer)
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-slate-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                            {/* Footer */}
                            <p className="text-xs text-slate-500 text-center mt-6">
                                {countdown > 0 ? (
                                    <>Your download is ready and will start automatically in {countdown} seconds</>
                                ) : (
                                    <span className="text-green-400 font-medium">Download started! Thank you for your support ❤️</span>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
