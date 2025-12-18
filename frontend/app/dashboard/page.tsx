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
import Logo from "@/components/Logo";

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
import { THEMES, FONTS } from "@/lib/constants";

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
    const [mobileTab, setMobileTab] = useState<'design' | 'content' | 'share'>('design');

    // New State for Multi-Platform
    const [platform, setPlatform] = useState('github');
    const [activeQuote, setActiveQuote] = useState(''); // Quote shown on card
    const [tempQuote, setTempQuote] = useState(''); // Quote in input

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ... (rest of code)


    useEffect(() => {
        let username = searchParams.get("username");
        const token = searchParams.get("token");
        const urlPlatform = searchParams.get("platform");

        if (urlPlatform) setPlatform(urlPlatform);

        if (token && username) {
            localStorage.setItem("devrecap_token", token);
            localStorage.setItem("devrecap_username", username);
            window.history.replaceState({}, '', `/dashboard?username=${username}&platform=${urlPlatform || 'github'}`);
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
                    params: { username, platform: urlPlatform || 'github' },
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
        const text = `Check out my Developer Recap! 🚀\n\nRank: ${stats?.rank}\nConsistency: ${stats?.consistencyScore}%\n\nCreate yours at: https://devrecap.site`;

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

    // --- Components ---

    // 1. Design Controls
    const DesignControls = () => (
        <div className="space-y-6">
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
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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

            {/* Custom Image */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Background
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
                    {customImage ? "Change Image" : "Upload Image"}
                </button>
                {customImage && (
                    <button
                        onClick={() => setCustomImage(null)}
                        className="text-xs text-red-400 mt-2 hover:underline w-full text-center"
                    >
                        Remove Background
                    </button>
                )}
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
        </div>
    );

    // 2. Content Controls
    const ContentControls = () => (
        <div className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">
                    Visibility
                </label>
                <div className="space-y-4">
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
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">
                    Charts & Links
                </label>
                <div className="flex items-center justify-between">
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

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                    <span className="text-sm text-slate-300">QR Code Link</span>
                    <div className="flex bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setQrType('github')}
                            className={clsx(
                                "px-3 py-1.5 text-xs rounded-md transition-all",
                                qrType === 'github' ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {platform === 'leetcode' ? 'LeetCode' : 'GitHub'}
                        </button>
                        <button
                            onClick={() => setQrType('app')}
                            className={clsx(
                                "px-3 py-1.5 text-xs rounded-md transition-all",
                                qrType === 'app' ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                            )}
                        >DevRecap</button>
                    </div>
                </div>

                {/* Custom Quote Input */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                        Custom Quote
                    </label>
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={tempQuote}
                            onChange={(e) => setTempQuote(e.target.value)}
                            placeholder="Add a favorite quote..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 outline-none resize-none"
                            rows={3}
                            maxLength={100}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500">{tempQuote.length}/100</span>
                            <button
                                onClick={() => setActiveQuote(tempQuote)}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                                Update Quote
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 3. Share Controls
    const ShareControls = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleShare}
                    className="py-4 bg-blue-600 active:bg-blue-700 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 shadow-lg"
                >
                    <Share2 className="w-6 h-6" />
                    <span>Native Share</span>
                </button>
                <button
                    onClick={downloadCard}
                    className="py-4 bg-slate-800 active:bg-slate-700 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 scroll-m-0"
                >
                    <Download className="w-6 h-6" />
                    <span>Save Image</span>
                </button>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                    Quick Share
                </label>
                <div className="flex gap-2">
                    <button onClick={() => shareToPlatform('whatsapp')} className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#25D366]/20">
                        WhatsApp
                    </button>
                    <button onClick={() => shareToPlatform('twitter')} className="flex-1 py-3 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1DA1F2]/20">
                        Twitter
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-slate-500 mt-6 px-4">
                Tip: Use "Native Share" to post directly to Instagram Stories or Snapchat on mobile devices.
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
                <Logo size={28} showText={true} />
                <button onClick={() => router.push('/')} className="text-xs font-medium bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-slate-300">Exit</button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* 1. PREVIEW SECTION */}
                <div className={clsx(
                    "flex-none relative bg-slate-950 flex items-center justify-center z-0 transition-all duration-300 overflow-hidden",
                    "lg:order-2 lg:w-2/3 lg:h-full lg:p-10 lg:pt-20",
                    // Mobile: Adjust height based on context but ensure preview is always visible
                    "w-full order-1 h-[45%] border-b border-slate-800 lg:border-none"
                )}>

                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />

                    {stats && (
                        <div
                            className="relative z-10 transition-transform duration-300 ease-out origin-center"
                            style={{ transform: `scale(${typeof window !== 'undefined' && window.innerWidth < 1024 ? previewScale * 0.55 : previewScale})` }}
                        >
                            <ThreeDCard
                                stats={stats}
                                theme={activeTheme}
                                font={activeFont}
                                isPremium={isPremium}
                                customImage={customImage}
                                customQuote={activeQuote}
                                platform={platform}
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

                {/* 2. CUSTOMIZATION PANEL */}
                <div className={clsx(
                    "lg:order-1 lg:w-1/3 bg-slate-900/30 border-r border-slate-800 lg:h-full lg:flex lg:flex-col",
                    // Mobile: Flex grow to fill space, clean background
                    "order-2 w-full flex-1 flex flex-col bg-slate-950 relative min-h-0"
                )}>

                    {/* SCROLLABLE CONTENT AREA */}
                    <div
                        className="flex-1 min-h-0 overflow-y-scroll overflow-x-hidden p-5 lg:p-6 lg:pt-28 pb-24 lg:pb-6"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            overscrollBehavior: 'contain'
                        }}
                    >

                        {/* Desktop Title */}
                        <div className="hidden lg:flex items-center gap-2 mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-blue-500" /> Configuration
                            </h2>
                        </div>

                        {/* Mobile: Conditional Rendering based on Tab */}
                        <div className="lg:hidden">
                            {mobileTab === 'design' && DesignControls()}
                            {mobileTab === 'content' && ContentControls()}
                            {mobileTab === 'share' && ShareControls()}
                        </div>

                        {/* Desktop: Show All */}
                        <div className="hidden lg:block space-y-8">
                            {DesignControls()}
                            {ContentControls()}
                            {ShareControls()}
                        </div>

                    </div>

                    {/* MOBILE TAB BAR */}
                    <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-2 pb-6 flex items-center justify-between z-50">
                        <button
                            onClick={() => setMobileTab('design')}
                            className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", mobileTab === 'design' ? "text-blue-400" : "text-slate-500")}
                        >
                            <Palette className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Design</span>
                        </button>
                        <button
                            onClick={() => setMobileTab('content')}
                            className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", mobileTab === 'content' ? "text-blue-400" : "text-slate-500")}
                        >
                            <Settings2 className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Content</span>
                        </button>
                        <button
                            onClick={() => setMobileTab('share')}
                            className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", mobileTab === 'share' ? "text-blue-400" : "text-slate-500")}
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Share</span>
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
