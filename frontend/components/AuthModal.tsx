"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Chrome, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const { signInWithGoogle, signInWithGithub } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Google sign-in error:', err);
            // Clean up error message
            const msg = err.message || 'Failed to sign in';
            setError(msg.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleGithubSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGithub();
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('GitHub sign-in error:', err);
            const msg = err.message || 'Failed to sign in';
            setError(msg.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* LEFT SIDE: Visual/Marketing (Hidden on mobile, shown on desktop) */}
                            <div className="hidden md:flex w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden">
                                {/* Background Effects */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 z-0" />
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />

                                {/* Glowing Orb */}
                                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                                <div className="relative z-10 flex flex-col gap-8">
                                    <div className="inline-flex items-center gap-3">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <span className="text-2xl font-bold text-white tracking-tight">DevRecap Premium</span>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight">
                                            Unlock your full <br /> developer story.
                                        </h3>

                                        <ul className="space-y-4">
                                            {[
                                                'High-resolution downloads',
                                                'Premium themes & fonts',
                                                'Remove watermarks',
                                                'Custom backgrounds'
                                            ].map((item, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    className="flex items-center gap-3 text-slate-300 font-medium"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                    {item}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-sm text-slate-500 border-l-2 border-slate-800 pl-4 italic">
                                            "The best way to showcase your GitHub contributions."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Login Form */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800">

                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                                    <p className="text-slate-400">Sign in to access your dashboard</p>
                                </div>

                                {/* Error Banner */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                                    >
                                        <div className="p-1 bg-red-500 rounded-full mt-0.5">
                                            <X className="w-3 h-3 text-white" />
                                        </div>
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="group w-full py-4 px-6 bg-white hover:bg-gray-50 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Chrome className="w-5 h-5" />
                                        )}
                                        <span>Sign in with Google</span>
                                    </button>

                                    <button
                                        onClick={handleGithubSignIn}
                                        disabled={loading}
                                        className="group w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Github className="w-5 h-5" />
                                        )}
                                        <span>Sign in with GitHub</span>
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                        By signing in, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
