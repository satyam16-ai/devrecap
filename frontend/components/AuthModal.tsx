"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Chrome, Loader2, Sparkles } from 'lucide-react';
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

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error('Google sign-in error:', err);
            setError(err.message || 'Failed to sign in with Google');
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
            setError(err.message || 'Failed to sign in with GitHub');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
                        >
                            {/* Premium Gradient Border Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />

                            <div className="relative bg-slate-900 rounded-3xl p-8">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        Unlock Premium Cards
                                    </h2>
                                    <p className="text-slate-400 text-sm">
                                        Sign in to download premium customized cards and prepare for future payment features
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    >
                                        <p className="text-red-400 text-sm text-center">{error}</p>
                                    </motion.div>
                                )}

                                {/* Sign In Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Chrome className="w-5 h-5" />
                                        )}
                                        Continue with Google
                                    </button>

                                    <button
                                        onClick={handleGithubSignIn}
                                        disabled={loading}
                                        className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-slate-700"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Github className="w-5 h-5" />
                                        )}
                                        Continue with GitHub
                                    </button>
                                </div>

                                {/* Features List */}
                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                        What you get:
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Download premium customized cards',
                                            'Access to all themes and fonts',
                                            'Custom backgrounds and quotes',
                                            'Ready for future premium features'
                                        ].map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Footer Note */}
                                <p className="text-xs text-slate-500 text-center mt-6">
                                    Non-premium cards can be downloaded without signing in
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
