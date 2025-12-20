"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, LogOut, User, LogIn, Clock } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import TransactionHistoryModal from "./TransactionHistoryModal";

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleSignOut = async () => {
        try {
            await signOut();
            setShowDropdown(false);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
        >
            <Link href="/" className="hover:opacity-80 transition">
                <Logo size={36} showText={true} />
            </Link>

            <div className="flex items-center gap-6">
                <Link href="#features" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Features</Link>
                <Link href="#hall-of-fame" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Hall of Fame</Link>
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Dashboard</Link>
                <Link href="/battle" className="text-sm font-bold text-yellow-500 hover:text-yellow-400 transition hidden md:flex items-center gap-1">
                    <span className="text-lg">⚔️</span> Versus
                </Link>
                <Link href="#report-issue" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Report Issue</Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                    >
                        <Github className="w-4 h-4" />
                        <span>Star</span>
                    </Link>

                    {/* User Profile or Login */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-full transition"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        className="w-6 h-6 rounded-full"
                                    />
                                ) : (
                                    <User className="w-4 h-4" />
                                )}
                                <span className="text-sm hidden sm:inline">{user.displayName?.split(' ')[0] || 'User'}</span>
                            </button>

                            {/* Dropdown */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowHistoryModal(true);
                                            setShowDropdown(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Purchase History
                                    </button>
                                    <div className="h-px bg-slate-800 my-1"></div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2 transition"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {/* History Modal (Global access via Navbar) */}
            <TransactionHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
        </motion.nav>
    );
}
