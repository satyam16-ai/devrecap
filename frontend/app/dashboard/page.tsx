"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2, Calendar, TrendingUp, Zap, Trophy, Download, Settings2, Palette, Type, Upload, Flame, Star, Share2 } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { motion } from "framer-motion";
import clsx from "clsx";
import ThreeDCard from "@/components/ThreeDCard";
import Navbar from "@/components/Navbar";

// --- Types ---
interface ContributionDay {
    count: number;
    level: number;
}
interface Stats {
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    smartBio: string;
    totalContributions: number;
    activeDays: number;
    longestStreak: number;
    consistencyScore: number;
    topLanguages: string[];
    rank: string;
    achievements: string[];
    history: ContributionDay[][];
}

// --- Constants ---
const THEMES = [
    { id: 'midnight', name: 'Midnight', bg: 'bg-gradient-to-br from-slate-900 to-slate-950', border: 'border-slate-800', text: 'text-slate-200', accent: 'text-blue-400', cell: 'bg-blue-500' },
    { id: 'sunset', name: 'Sunset', bg: 'bg-gradient-to-br from-orange-950 to-slate-900', border: 'border-orange-500/30', text: 'text-orange-100', accent: 'text-orange-400', cell: 'bg-orange-500' },
    { id: 'cyberpunk', name: 'Cyberpunk', bg: 'bg-gradient-to-br from-fuchsia-950 to-purple-950', border: 'border-fuchsia-500/30', text: 'text-fuchsia-100', accent: 'text-fuchsia-400', cell: 'bg-fuchsia-500' },
    { id: 'forest', name: 'Forest', bg: 'bg-gradient-to-br from-emerald-950 to-green-950', border: 'border-emerald-500/30', text: 'text-emerald-100', accent: 'text-emerald-400', cell: 'bg-emerald-500' },
    { id: 'crimson', name: 'Crimson', bg: 'bg-gradient-to-br from-red-950 to-slate-950', border: 'border-red-500/30', text: 'text-red-100', accent: 'text-red-400', cell: 'bg-red-500' },
    { id: 'aurora', name: 'Aurora', bg: 'bg-gradient-to-br from-teal-950 to-slate-900', border: 'border-teal-500/30', text: 'text-teal-100', accent: 'text-teal-400', cell: 'bg-teal-500' },
    { id: 'golden', name: 'Golden Hour', bg: 'bg-gradient-to-br from-yellow-950 to-amber-950', border: 'border-yellow-500/30', text: 'text-yellow-100', accent: 'text-yellow-400', cell: 'bg-yellow-500' },
    { id: 'ice', name: 'Glacier', bg: 'bg-gradient-to-br from-cyan-950 to-blue-950', border: 'border-cyan-500/30', text: 'text-cyan-100', accent: 'text-cyan-400', cell: 'bg-cyan-500' },
    { id: 'lavender', name: 'Lavender', bg: 'bg-gradient-to-br from-violet-950 to-slate-900', border: 'border-violet-500/30', text: 'text-violet-100', accent: 'text-violet-400', cell: 'bg-violet-500' },
    { id: 'cotton_candy', name: 'Cotton Candy', bg: 'bg-gradient-to-br from-pink-300 to-purple-300', border: 'border-pink-200', text: 'text-pink-900', accent: 'text-purple-600', cell: 'bg-pink-500' },
    { id: 'matrix', name: 'The Matrix', bg: 'bg-black', border: 'border-green-500', text: 'text-green-400', accent: 'text-green-500', cell: 'bg-green-600' },
    { id: 'dracula', name: 'Vampire', bg: 'bg-gradient-to-br from-gray-900 to-red-950', border: 'border-red-900', text: 'text-gray-100', accent: 'text-red-500', cell: 'bg-red-600' },
];

const FONTS = [
    { id: 'sans', name: 'Modern Sans', class: 'font-sans' },
    { id: 'mono', name: 'Developer Mono', class: 'font-mono' },
    { id: 'serif', name: 'Classic Serif', class: 'font-serif' },
    { id: 'system', name: 'System UI', class: 'font-[system-ui]' },
    // We are relying on potential Google Fonts being available or falling back
];

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // customization state
    const [activeTheme, setActiveTheme] = useState(THEMES[0]);
    const [activeFont, setActiveFont] = useState(FONTS[0]);
    const [isPremium, setIsPremium] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);

    // Visibility & Options
    const [showAvatar, setShowAvatar] = useState(true);
    const [showBio, setShowBio] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const [showBadges, setShowBadges] = useState(true);
    const [qrType, setQrType] = useState<'github' | 'app'>('github');
    const [activityType, setActivityType] = useState<'heatmap' | 'line' | 'bar'>('heatmap');
    const [previewScale, setPreviewScale] = useState(0.85);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ... (rest of code)


    useEffect(() => {
        let username = searchParams.get("username");
        const token = searchParams.get("token");

        if (token && username) {
            localStorage.setItem("devrecap_token", token);
            localStorage.setItem("devrecap_username", username);
            window.history.replaceState({}, '', `/dashboard?username=${username}`);
        } else if (!username) {
            const savedUsername = localStorage.getItem("devrecap_username");
            if (savedUsername) {
                username = savedUsername;
            } else {
                router.push("/");
                return;
            }
        }

        const fetchStats = async () => {
            try {
                setLoading(true);
                const authToken = token || localStorage.getItem("devrecap_token");
                const response = await axios.get("http://localhost:5000/api/stats", {
                    params: { username },
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
                });
                setStats(response.data);
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.error || "Failed to load stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [searchParams, router]);

    const downloadCard = async () => {
        const node = document.getElementById('preview-card-3d');
        if (node) {
            try {
                const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 3 });
                download(dataUrl, `${stats?.username}-devrecap.png`);
            } catch (error) {
                console.error('Download failed', error);
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = async () => {
        const node = document.getElementById('preview-card-3d');
        if (!node) return;

        setLoading(true);
        try {
            const blob = await htmlToImage.toBlob(node, { pixelRatio: 2 });
            if (!blob) throw new Error("Failed to generate image");

            const file = new File([blob], `${stats?.username}-devrecap.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'My Developer Recap',
                    text: `Check out my GitHub stats! Generated by DevRecap.`,
                    files: [file]
                });
            } else {
                alert("Web Share API not supported or available on this device. Downloading image instead.");
                download(blob, `${stats?.username}-devrecap.png`);
            }
        } catch (error) {
            console.error('Share failed', error);
            alert("Error sharing image.");
        } finally {
            setLoading(false);
        }
    };

    const shareToPlatform = (platform: 'whatsapp' | 'twitter') => {
        const text = `Check out my Developer Recap! 🚀\n\nRank: ${stats?.rank}\nConsistency: ${stats?.consistencyScore}%\n\nCreate yours at: https://devrecap.com`;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            >
                <Loader2 className="w-10 h-10 text-blue-500" />
            </motion.div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500">Error</h2>
                <p className="text-slate-400 mb-4">{error}</p>
                <button onClick={() => router.push('/')} className="text-blue-400 hover:underline">Go Home</button>
            </div>
        </div>
    );

    // --- Update Layout to be Fixed Height with Scroll ---
    return (
        <div className="h-[100dvh] bg-slate-950 text-white font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-50 shrink-0">
                <span className="font-bold text-lg text-white flex items-center gap-2">
                    <div className="bg-blue-500 p-1 rounded-md"><Zap className="w-3 h-3 text-white" /></div>
                    DevRecap
                </span>
                <button onClick={() => router.push('/')} className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-300">Exit</button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* 1. PREVIEW SECTION (Top on Mobile, Right on Desktop) */}
                <div className="order-1 lg:order-2 w-full lg:w-2/3 h-[45%] lg:h-full flex items-center justify-center bg-slate-950 p-4 lg:p-10 lg:pt-28 relative shrink-0">
                    <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />

                    {stats && (
                        <div
                            className="relative z-10 transition-transform duration-300 ease-out origin-center my-auto"
                            style={{ transform: `scale(${typeof window !== 'undefined' && window.innerWidth < 1024 ? previewScale * 0.6 : previewScale})` }}
                        >
                            <ThreeDCard
                                stats={stats}
                                theme={activeTheme}
                                font={activeFont}
                                isPremium={isPremium}
                                customImage={customImage}
                                options={{
                                    showAvatar,
                                    showBio,
                                    showHeatmap,
                                    showStats,
                                    showBadges,
                                    qrType,
                                    activityType
                                }}
                            />
                        </div>
                    )}

                    {/* Scale Slider Overlay */}
                    <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 bg-slate-900/80 backdrop-blur-md p-2 lg:p-3 rounded-xl border border-slate-800 flex items-center gap-2 lg:gap-3 z-50">
                        <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">Zoom</span>
                        <input
                            type="range"
                            min="0.5"
                            max="1.2"
                            step="0.05"
                            value={previewScale}
                            onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                            className="w-20 lg:w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {/* 2. CUSTOMIZATION PANEL (Bottom on Mobile, Left on Desktop) */}
                <div className="order-2 lg:order-1 w-full lg:w-1/3 bg-slate-900/30 border-t lg:border-t-0 lg:border-r border-slate-800 h-full overflow-y-auto p-4 lg:p-6 lg:pt-28 space-y-6 lg:space-y-8 pb-24 lg:pb-6">

                    <div className="hidden lg:flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-blue-500" /> Configuration
                        </h2>
                    </div>

                    {/* Actions Grid for Mobile */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        <button
                            onClick={handleShare}
                            className="py-3 bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button
                            onClick={downloadCard}
                            className="py-3 bg-slate-800 active:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Save
                        </button>
                    </div>

                    {/* Social Quick Share */}
                    <div className="flex gap-2">
                        <button onClick={() => shareToPlatform('whatsapp')} className="flex-1 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#25D366]/20">
                            WhatsApp
                        </button>
                        <button onClick={() => shareToPlatform('twitter')} className="flex-1 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1DA1F2]/20">
                            Twitter
                        </button>
                    </div>

                    {/* Visibility Toggles */}
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">
                            Visibility & Layout
                        </label>
                        <div className="space-y-3">
                            {[
                                { label: "Show Avatar", state: showAvatar, set: setShowAvatar },
                                { label: "Show Smart Bio", state: showBio, set: setShowBio },
                                { label: "Show Heatmap", state: showHeatmap, set: setShowHeatmap },
                                { label: "Show Stats Grid", state: showStats, set: setShowStats },
                                { label: "Show Badges", state: showBadges, set: setShowBadges },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300">{item.label}</span>
                                    <button
                                        onClick={() => item.set(!item.state)}
                                        className={clsx(
                                            "w-10 h-5 rounded-full relative transition-colors duration-300",
                                            item.state ? "bg-blue-500" : "bg-slate-700"
                                        )}
                                    >
                                        <div className={clsx(
                                            "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300",
                                            item.state ? "left-6" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
                                <span className="text-sm text-slate-300">Activity Style</span>
                                <div className="flex bg-slate-800 rounded-lg p-1">
                                    {[
                                        { id: 'heatmap', icon: <Flame className="w-3 h-3" /> },
                                        { id: 'line', icon: <TrendingUp className="w-3 h-3" /> },
                                        { id: 'bar', icon: <Calendar className="w-3 h-3" /> },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setActivityType(type.id as any)}
                                            className={clsx(
                                                "w-8 h-6 flex items-center justify-center rounded-md transition-all",
                                                activityType === type.id ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {type.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
                                <span className="text-sm text-slate-300">QR Code Link</span>
                                <div className="flex bg-slate-800 rounded-lg p-1">
                                    <button
                                        onClick={() => setQrType('github')}
                                        className={clsx(
                                            "px-2 py-1 text-xs rounded-md transition-all",
                                            qrType === 'github' ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                                        )}
                                    >My Profile</button>
                                    <button
                                        onClick={() => setQrType('app')}
                                        className={clsx(
                                            "px-2 py-1 text-xs rounded-md transition-all",
                                            qrType === 'app' ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                                        )}
                                    >DevRecap</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Selector */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Theme
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {THEMES.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => setActiveTheme(theme)}
                                    className={clsx(
                                        "px-3 py-3 rounded-xl text-xs font-medium transition-all text-left border",
                                        activeTheme.id === theme.id
                                            ? "bg-slate-800 border-blue-500 text-white"
                                            : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={clsx("w-3 h-3 rounded-full", theme.cell.replace('bg-', 'bg-'))}></div>
                                        {theme.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Selector */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                            <Type className="w-4 h-4" /> Typography
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {FONTS.map(font => (
                                <button
                                    key={font.id}
                                    onClick={() => setActiveFont(font)}
                                    className={clsx(
                                        "px-4 py-2 rounded-lg text-sm border transition-all whitespace-nowrap",
                                        activeFont.id === font.id
                                            ? "bg-slate-800 border-white text-white"
                                            : "bg-slate-950/50 border-slate-800 text-slate-400"
                                    )}
                                >
                                    {font.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Premium Toggle */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-yellow-400 flex items-center gap-2 text-sm">
                                <Trophy className="w-4 h-4" /> Premium Mode
                            </span>
                            <button
                                onClick={() => setIsPremium(!isPremium)}
                                className={clsx(
                                    "w-10 h-6 rounded-full p-1 transition-colors duration-300",
                                    isPremium ? "bg-yellow-500" : "bg-slate-700"
                                )}
                            >
                                <div className={clsx(
                                    "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300",
                                    isPremium ? "translate-x-4" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    </div>

                    {/* Custom Image Upload */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Custom Background
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 text-sm hover:border-slate-500 hover:text-white transition"
                        >
                            Drag & Drop or Click to Upload
                        </button>
                        {customImage && (
                            <button
                                onClick={() => setCustomImage(null)}
                                className="text-xs text-red-400 mt-2 hover:underline"
                            >
                                Remove Background
                            </button>
                        )}
                    </div>

                    <div className="pt-4 space-y-3 pb-12 hidden lg:block">
                        <button
                            onClick={handleShare}
                            className="w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mb-3"
                        >
                            <Share2 className="w-5 h-5" /> Share Image
                        </button>

                        <button
                            onClick={downloadCard}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                        >
                            <Download className="w-5 h-5" /> Download HD PNG
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
