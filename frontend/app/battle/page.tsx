"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Loader2, Swords, Download, Share2, ArrowLeft } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import Link from 'next/link';
import BattleCard from "@/components/BattleCard";
import { Stats } from "@/components/RecapCard";
import Navbar from "@/components/Navbar";
import { THEMES, FONTS } from "@/lib/constants";
import clsx from "clsx";

export default function BattlePage() {
    const [p1Name, setP1Name] = useState("");
    const [p2Name, setP2Name] = useState("");
    const [p1Stats, setP1Stats] = useState<Stats | null>(null);
    const [p2Stats, setP2Stats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [battleStarted, setBattleStarted] = useState(false);
    const [error, setError] = useState("");

    // Customization
    const [activeTheme, setActiveTheme] = useState(THEMES.find(t => t.id === 'stark') || THEMES[0]);
    const [activeFont, setActiveFont] = useState(FONTS[0]);

    const startBattle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!p1Name || !p2Name) return;

        setLoading(true);
        setError("");
        setBattleStarted(false);

        try {
            // Add slight delay for dramatic effect if needed, but for now direct fetch
            const [res1, res2] = await Promise.all([
                axios.get(`/api/github/${p1Name}`),
                axios.get(`/api/github/${p2Name}`)
            ]);

            setP1Stats(res1.data);
            setP2Stats(res2.data);
            setBattleStarted(true);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch fighters. Check usernames and try again.");
        } finally {
            setLoading(false);
        }
    };

    const downloadBattleCard = async () => {
        const node = document.getElementById("battle-card-container");
        if (!node) return;

        try {
            const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
            download(dataUrl, `battle-${p1Name}-vs-${p2Name}.png`);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-yellow-500/30">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter bg-gradient-to-br from-yellow-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                        Versus Arena
                    </h1>
                    <p className="text-slate-400 mt-4 font-mono">1v1 Code Battles. Who is the superior dev?</p>
                </div>

                {!battleStarted ? (
                    /* SETUP SCREEN */
                    <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                        <form onSubmit={startBattle} className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative">
                                {/* P1 Input */}
                                <div className="w-full">
                                    <label className="block text-xs uppercase font-bold text-blue-400 tracking-widest mb-2">Challenger 1 (You)</label>
                                    <input
                                        type="text"
                                        value={p1Name}
                                        onChange={(e) => setP1Name(e.target.value)}
                                        placeholder="github_username"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-center font-mono focus:border-blue-500 focus:outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>

                                {/* VS Circle */}
                                <div className="hidden md:flex flex-col items-center justify-center shrink-0 z-10">
                                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-black italic shadow-lg animate-pulse">
                                        VS
                                    </div>
                                </div>

                                {/* P2 Input */}
                                <div className="w-full">
                                    <label className="block text-xs uppercase font-bold text-red-400 tracking-widest mb-2">Challenger 2 (Rival)</label>
                                    <input
                                        type="text"
                                        value={p2Name}
                                        onChange={(e) => setP2Name(e.target.value)}
                                        placeholder="rival_username"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-center font-mono focus:border-red-500 focus:outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading || !p1Name || !p2Name}
                                    className="group relative px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin w-5 h-5" /> Scouting...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-xl">
                                            <Swords className="w-6 h-6" /> FITGHT!
                                        </span>
                                    )}
                                    {/* Button particles/glow effect could go here */}
                                    <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* BATTLE ARENA SCREEN */
                    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">

                        {/* Actions Bar */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setBattleStarted(false)}
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-sm flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" /> Rematch
                            </button>
                            <button
                                onClick={downloadBattleCard}
                                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <Download className="w-4 h-4" /> Download Card
                            </button>
                        </div>

                        {/* Theme Selectors (Mini) */}
                        <div className="flex gap-2 mb-8 overflow-x-auto max-w-full pb-2 px-2 scrollbar-hide">
                            {THEMES.filter(t => t.isPremium).map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setActiveTheme(theme)}
                                    className={clsx(
                                        "w-8 h-8 rounded-full border-2 transition-all shrink-0",
                                        theme.bg,
                                        activeTheme.id === theme.id ? "border-white scale-110 shadow-[0_0_10px_white]" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                    title={theme.name}
                                />
                            ))}
                        </div>

                        {/* The CARD */}
                        <div className="relative group">
                            {/* Canvas/Container for Image Generation */}
                            <div id="battle-card-container">
                                {p1Stats && p2Stats && (
                                    <BattleCard
                                        p1={p1Stats}
                                        p2={p2Stats}
                                        theme={activeTheme}
                                        font={activeFont}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
