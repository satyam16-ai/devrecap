"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Swords, Construction, Trophy, ArrowRight, Loader2, Download, Share2 } from "lucide-react";
import Link from 'next/link';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BattleCard from "@/components/BattleCard";
import { THEMES, FONTS } from "@/lib/constants";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { DesignPanel } from "@/components/DesignPanel";
import { Settings2, Palette } from "lucide-react";
import clsx from "clsx";

import type { Stats } from "@/components/RecapCard";

export default function BattlePage() {
    const [u1, setU1] = useState("");
    const [u2, setU2] = useState("");
    const [loading, setLoading] = useState(false);
    const [battleData, setBattleData] = useState<{ p1: Stats, p2: Stats, winner: 'p1' | 'p2' | 'tie' } | null>(null);
    const [error, setError] = useState("");

    // Customization State
    const [activeTheme, setActiveTheme] = useState(THEMES[0]);
    const [activeFont, setActiveFont] = useState(FONTS[0]);
    const [isPremium, setIsPremium] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [showDesignPanel, setShowDesignPanel] = useState(false);

    const handleBattle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!u1 || !u2) return;

        setLoading(true);
        setError("");
        setBattleData(null);

        try {
            // Fetch both in parallel
            const [r1, r2] = await Promise.all([
                axios.get("/api/stats", { params: { username: u1 } }),
                axios.get("/api/stats", { params: { username: u2 } })
            ]);

            const p1 = r1.data;
            const p2 = r2.data;

            // Determine Winner
            let winner: 'p1' | 'p2' | 'tie' = 'tie';

            // Simple scoring algorithm
            const score1 = p1.totalContributions + (p1.longestStreak * 5) + (p1.consistencyScore * 10);
            const score2 = p2.totalContributions + (p2.longestStreak * 5) + (p2.consistencyScore * 10);

            if (score1 > score2) winner = 'p1';
            else if (score2 > score1) winner = 'p2';

            setBattleData({ p1, p2, winner });

        } catch (err) {
            console.error(err);
            setError("Could not retrieve stats for one or both users. Please check usernames.");
        } finally {
            setLoading(false);
        }
    };

    const downloadBattleCard = async () => {
        const node = document.getElementById('battle-card-container');
        if (!node) return;

        try {
            const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
            download(dataUrl, `battle-${u1}-vs-${u2}.png`);
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download image.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-red-500/30 relative overflow-x-hidden flex flex-col font-sans">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-[100px]" />
                <div className="absolute top-0 left-0 w-1/2 h-full bg-red-900/10 blur-[100px]" />
            </div>

            <main className="flex-1 pt-24 pb-12 px-4 flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Swords className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Versus</span> Battle
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto text-lg">
                        Compare stats, streaks, and ranks. Find out who is the true coding champion.
                    </p>
                </div>

                {/* Input Form */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onSubmit={handleBattle}
                    className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-16 relative z-10"
                >
                    {/* User 1 Input */}
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <input
                                type="text"
                                placeholder="Challenger 1 (GitHub)"
                                value={u1}
                                onChange={(e) => setU1(e.target.value)}
                                className="relative w-full bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 text-center font-bold placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* VS Circle */}
                    <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-black italic text-slate-500 border border-slate-700">
                        VS
                    </div>

                    {/* User 2 Input */}
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                            <input
                                type="text"
                                placeholder="Challenger 2 (GitHub)"
                                value={u2}
                                onChange={(e) => setU2(e.target.value)}
                                className="relative w-full bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 text-center font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !u1 || !u2}
                        className="w-full md:w-auto px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Fight <Swords className="w-5 h-5" /></>}
                    </button>
                </motion.form>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl mb-8"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Battle Arena (Result) */}
                <AnimatePresence>
                    {battleData && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            className="w-full flex flex-col lg:flex-row items-start justify-center gap-10"
                        >
                            {/* Left Side: Card */}
                            <div className="flex flex-col items-center gap-6">
                                <div id="battle-card-container" className="shadow-2xl shadow-red-500/10 rounded-[3rem]">
                                    <BattleCard
                                        p1={battleData.p1}
                                        p2={battleData.p2}
                                        winner={battleData.winner}
                                        theme={activeTheme}
                                        font={activeFont}
                                        isPremium={isPremium}
                                        customImage={customImage}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={downloadBattleCard}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
                                    >
                                        <Download className="w-5 h-5" /> Save Card
                                    </button>
                                    <button
                                        onClick={() => setShowDesignPanel(!showDesignPanel)}
                                        className="lg:hidden px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2"
                                    >
                                        <Palette className="w-5 h-5" /> Customize
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Customization Panel (Desktop) */}
                            <div className="hidden lg:block w-full max-w-sm bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                                    <Settings2 className="w-5 h-5 text-blue-500" />
                                    <h2 className="font-bold text-lg">Battle Config</h2>
                                </div>
                                <DesignPanel
                                    activeTheme={activeTheme}
                                    setActiveTheme={setActiveTheme}
                                    activeFont={activeFont}
                                    setActiveFont={setActiveFont}
                                    customImage={customImage}
                                    setCustomImage={setCustomImage}
                                    isPremium={isPremium}
                                    setIsPremium={setIsPremium}
                                />
                            </div>

                            {/* Mobile Slide-up Panel */}
                            <AnimatePresence>
                                {showDesignPanel && (
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        className="fixed inset-x-0 bottom-0 z-50 bg-slate-950 border-t border-slate-800 p-6 rounded-t-3xl shadow-xl lg:hidden max-h-[80vh] overflow-y-auto"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="font-bold text-lg">Customize Battle</h2>
                                            <button onClick={() => setShowDesignPanel(false)} className="text-slate-400">Close</button>
                                        </div>
                                        <DesignPanel
                                            activeTheme={activeTheme}
                                            setActiveTheme={setActiveTheme}
                                            activeFont={activeFont}
                                            setActiveFont={setActiveFont}
                                            customImage={customImage}
                                            setCustomImage={setCustomImage}
                                            isPremium={isPremium}
                                            setIsPremium={setIsPremium}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}
