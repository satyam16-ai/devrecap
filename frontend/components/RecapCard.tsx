import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, TrendingUp, Trophy, Flame, Star, CheckCircle2, Github, Code } from "lucide-react";
import clsx from "clsx";
import { QRCodeSVG } from 'qrcode.react';

interface ContributionDay {
    count: number;
    level: number;
}

export interface Stats {
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

interface RecapCardProps {
    stats: Stats;
    theme: any;
    font: any;
    isPremium: boolean;
    customImage: string | null;
    customQuote?: string; // New Prop
    platform?: string; // New Prop
    id?: string;
    showWatermark?: boolean; // New Prop for watermark
    options?: {
        showAvatar: boolean;
        showBio: boolean;
        showHeatmap: boolean;
        showStats: boolean;
        showBadges: boolean;
        qrType: 'github' | 'app';
        activityType: 'heatmap' | 'line' | 'bar';
    };
}

export default function RecapCard({ stats, theme, font, isPremium, customImage, customQuote = "", platform = "github", id = "recap-card", showWatermark = false,
    options = { showAvatar: true, showBio: true, showHeatmap: true, showStats: true, showBadges: true, qrType: 'github', activityType: 'heatmap' }
}: RecapCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Correct QR URL based on platform if qrType is 'github' (which means profile)
    const getProfileUrl = () => {
        if (platform === 'leetcode') return `https://leetcode.com/${stats.username}`;
        return `https://github.com/${stats.username}`;
    };

    const qrUrl = options.qrType === 'app' ? 'https://devrecap.site' : getProfileUrl();

    // --- Feature 1: Developer Persona (Free Feature) ---
    // Calculate based on stats
    const getDeveloperPersona = () => {
        if (!stats) return "Code Explorer";
        if (stats.longestStreak > 30) return "Consistency King";
        if (stats.totalContributions > 2000) return "Commit Machine";
        if (stats.totalContributions < 100) return "Junior Dev";

        // Check weekend activity if history exists
        if (stats.history && stats.history.length > 0) {
            let weekendCommits = 0;
            let totalCommits = 0;
            stats.history.forEach(week => {
                week.forEach((day, idx) => {
                    if (day) {
                        totalCommits += day.count;
                        if (idx === 0 || idx === 6) weekendCommits += day.count;
                    }
                });
            });
            if (totalCommits > 0 && (weekendCommits / totalCommits) > 0.4) return "Weekend Warrior";
        }

        return "Full Stack Ninja";
    };

    const persona = getDeveloperPersona();

    // --- Feature 2: Background Patterns (Premium Visuals) ---
    const getThemePattern = () => {
        if (['matrix', 'cyberpunk', 'fira'].includes(theme.id)) {
            // Circuit / Tech Pattern
            return (
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M10 10h10v10h-10z M50 50h10v10h-10z M80 20h10v10h-10z" fill="currentColor" />
                            <path d="M20 15h30v2h-30z M60 55h20v2h-20z M15 20v20h2v-20z" fill="currentColor" />
                            <circle cx="15" cy="15" r="2" fill="currentColor" />
                            <circle cx="55" cy="55" r="2" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit)" />
                </svg>
            );
        }
        if (['oceanic', 'ice', 'aurora'].includes(theme.id)) {
            // Topographic / Waves Pattern
            return (
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <filter id='noiseFilter'>
                        <feTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch' />
                    </filter>
                    <rect width='100%' height='100%' filter='url(#noiseFilter)' opacity="0.4" />
                    <path d="M0 50 Q 112.5 100 225 50 T 450 50" stroke="currentColor" fill="none" className="opacity-30" strokeWidth="2" />
                    <path d="M0 150 Q 112.5 200 225 150 T 450 150" stroke="currentColor" fill="none" className="opacity-30" strokeWidth="2" />
                    <path d="M0 250 Q 112.5 300 225 250 T 450 250" stroke="currentColor" fill="none" className="opacity-30" strokeWidth="2" />
                </svg>
            );
        }
        if (['sunset', 'golden', 'lavender'].includes(theme.id)) {
            // Grain + Gradient Overlay
            return (
                <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
                />
            );
        }
        if (theme.id === 'blueprint') {
            return (
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path d="M0 100 H450 M0 300 H450 M100 0 V600 M300 0 V600" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                </svg>
            );
        }
        if (theme.id === 'retro') {
            return (
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="pixels" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="10" height="10" fill="currentColor" opacity="0.5" />
                        <rect x="10" y="10" width="10" height="10" fill="currentColor" opacity="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pixels)" />
                </svg>
            );
        }
        if (theme.id === 'neural') {
            return (
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="2" fill="currentColor"><animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" /></circle>
                    <circle cx="400" cy="100" r="2" fill="currentColor"><animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" /></circle>
                    <circle cx="200" cy="300" r="2" fill="currentColor"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" /></circle>
                    <circle cx="350" cy="500" r="2" fill="currentColor"><animate attributeName="opacity" values="0.3;1;0.3" dur="5s" repeatCount="indefinite" /></circle>
                    <path d="M50 50 L200 300 L400 100 L350 500" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
                </svg>
            )
        }
        if (theme.id === 'ronin') {
            return (
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {/* Rising Sun */}
                    <circle cx="50%" cy="30%" r="60" fill="#dc2626" opacity="0.3" />
                    {/* Katana Slash */}
                    <path d="M-50 400 L500 -50" stroke="#ef4444" strokeWidth="4" opacity="0.8" />
                    <path d="M-20 420 L530 -30" stroke="#ef4444" strokeWidth="1" opacity="0.4" />
                    {/* Ink Texture */}
                    <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="0.8" /></filter>
                    <rect width="100%" height="100%" filter="url(#ink)" opacity="0.15" />
                </svg>
            );
        }
        if (theme.id === 'anime') {
            return (
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="animeGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="100%" stopColor="#f472b6" />
                        </radialGradient>
                    </defs>
                    {/* Burst Lines */}
                    {Array.from({ length: 40 }).map((_, i) => {
                        const angle = (i / 40) * Math.PI * 2;
                        const x2 = 50 + Math.cos(angle) * 80;
                        const y2 = 50 + Math.sin(angle) * 80;
                        return <path key={i} d={`M50 50 L${x2} ${y2}`} stroke="url(#animeGrad)" strokeWidth={Math.random()} opacity="0.5" />
                    })}
                </svg>
            );
        }
        if (theme.id === 'stark') {
            return (
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0891b2_0%,_transparent_70%)] opacity-30" />
                    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" style={{ animation: 'spin 20s linear infinite' }}>
                        <circle cx="50" cy="50" r="30" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeDasharray="10 5" />
                        <circle cx="50" cy="50" r="40" stroke="#22d3ee" strokeWidth="0.2" fill="none" />
                        <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" stroke="#22d3ee" strokeWidth="1" />
                    </svg>
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" style={{ animation: 'spin 15s linear infinite reverse' }}>
                        <circle cx="50" cy="50" r="25" stroke="#22d3ee" strokeWidth="1" fill="none" strokeDasharray="1 3" />
                    </svg>
                </div>
            )
        }
        if (theme.id === 'spidey') {
            return (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    {/* Web Center */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ellipse key={i} cx="50" cy="50" rx={i * 10} ry={i * 8} fill="none" stroke="#ef4444" strokeWidth="0.3" opacity="0.6" />
                    ))}
                    {/* Radial Lines */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <path key={i} d={`M50 50 L${50 + Math.cos(i * Math.PI / 6) * 100} ${50 + Math.sin(i * Math.PI / 6) * 100}`} stroke="#ef4444" strokeWidth="0.3" opacity="0.6" />
                    ))}
                    {/* Eyes hint */}
                    <path d="M35 45 Q 45 40 50 45" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
                    <path d="M65 45 Q 55 40 50 45" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
                </svg>
            )
        }
        if (theme.id === 'knight') {
            return (
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-black">
                    {/* Rain */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    {/* Bat Signal Light */}
                    <div className="absolute top-[-40px] left-[20%] w-[60%] h-[120%] bg-gradient-to-b from-yellow-500/20 to-transparent blur-2xl transform rotate-12" />
                    {/* Signal Silhouette */}
                    <svg className="absolute top-[10%] left-[35%] w-[30%] h-[20%] opacity-80 mix-blend-overlay" viewBox="0 0 100 60">
                        <ellipse cx="50" cy="30" rx="40" ry="25" fill="#facc15" opacity="0.1" filter="blur(5px)" />
                    </svg>
                </div>
            )
        }

        // Geometric / Hexagon for others
        return (
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                    <pattern id="hex" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                        <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex)" />
            </svg>
        );
    };



    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (showWatermark) {
            setMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div
            id={id}
            onMouseEnter={() => showWatermark && setIsHovered(true)}
            onMouseLeave={() => showWatermark && setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className={clsx(
                // FIXED 9:16 RATIO for Instagram Stories (450px x 800px)
                "relative w-[450px] h-[800px] rounded-[2rem] overflow-hidden p-8 flex flex-col justify-between shadow-2xl transition-all duration-300",
                theme.bg,
                isPremium ? "border-2 border-yellow-500/50 shadow-yellow-500/20" : `border ${theme.border}`,
                font.class
            )}
            style={{
                transformStyle: 'preserve-3d', // Enable 3D for children
                transform: showWatermark && !isHovered ? 'scale(0.98)' : 'scale(1)',
                cursor: showWatermark && isHovered ? 'none' : 'default'
            }}
        >
            {/* 1. Theme Patterns (Behind everything) */}
            <div className={clsx("absolute inset-0 pointer-events-none", isPremium ? "opacity-100" : "opacity-0")}>
                {getThemePattern()}
            </div>

            {/* 2. Holographic Sheen (Premium Only) */}
            {isPremium && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
            )}

            {/* Hover Instruction Message with Backdrop Blur */}
            {showWatermark && !isHovered && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none backdrop-blur-[8px] transition-all duration-300">
                    <div className="bg-black/90 border border-yellow-500/50 px-6 py-3 rounded-full shadow-2xl animate-pulse flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-yellow-100 uppercase tracking-widest">Hover to Preview</span>
                    </div>
                </div>
            )}

            {/* Large Black Transparent Circle Cursor - Anti-Screenshot */}
            {mounted && showWatermark && isHovered && createPortal(
                <div
                    className="pointer-events-none fixed z-[99999]"
                    style={{
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        border: '2px solid rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(0px)',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.5)',
                    }}
                />,
                document.body
            )}

            {/* Custom BG Overlay */}
            {customImage && (
                <img src={customImage} className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" />
            )}

            {/* Premium Shine & Holographic Effect */}
            {isPremium && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10 pointer-events-none" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-600 blur-[80px] opacity-40 z-0" />
                </>
            )}

            {/* Content Container */}
            <div className="relative z-20 h-full flex flex-col gap-6">

                {/* Platform Logo Watermark */}
                <div className="absolute top-0 right-0 p-2 opacity-50">
                    {platform === 'leetcode' ? (
                        <Code className="w-6 h-6 text-orange-400" />
                    ) : (
                        <Github className="w-6 h-6 text-slate-400" />
                    )}
                </div>

                {/* 1. Header & Identity */}
                <div className="flex flex-col items-center text-center">
                    <span className="mb-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[10px] uppercase font-bold tracking-widest text-white/70">
                        {platform === 'leetcode' ? 'LeetCode Recap 2025' : 'GitHub Recap 2025'}
                    </span>

                    {/* Developer Persona Badge (New Feature) */}
                    <div className="mb-4 mt-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-bold text-white tracking-wide">{persona}</span>
                    </div>
                    {options.showAvatar && (
                        <div className={clsx(
                            "p-1.5 rounded-full mb-3",
                            isPremium ? "bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20" : "bg-white/10"
                        )}>
                            <img
                                src={stats.avatarUrl}
                                className="w-20 h-20 rounded-full border-4 border-slate-950 object-cover"
                                style={isPremium ? { transform: 'translateZ(40px)' } : {}}
                            />
                        </div>
                    )}
                    <h2 className={clsx(
                        "text-3xl font-black leading-tight tracking-tight",
                        isPremium ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 drop-shadow-sm" : "text-white"
                    )}
                        style={isPremium ? { transform: 'translateZ(30px)' } : {}}
                    >
                        {stats.name || stats.username}
                    </h2>
                    <div
                        className={clsx("text-sm font-semibold opacity-80 mt-1 flex items-center justify-center gap-1.5", theme.accent)}
                        style={isPremium ? { transform: 'translateZ(20px)' } : {}}
                    >
                        @{stats.username}
                        {isPremium && (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/50 blur-sm rounded-full" />
                                <div className="relative bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full p-[2px] shadow-lg">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" fill="transparent" strokeWidth={3} />
                                </div>
                            </div>
                        )}
                    </div>
                    {isPremium && (
                        <div
                            className="mt-1 text-[10px] font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 uppercase drop-shadow-md"
                            style={{ transform: 'translateZ(20px)' }}
                        >
                            Elite Developer
                        </div>
                    )}

                    {/* Dynamic Generated Bio */}
                    {options.showBio && (
                        <div className="mt-3 px-4 py-2 bg-black/20 rounded-xl backdrop-blur-sm border border-white/5 mx-auto max-w-xs">
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                "{stats.smartBio}"
                            </p>
                        </div>
                    )}

                    {/* Custom Quote - New Feature */}
                    {customQuote && (
                        <div className="mt-2 text-center max-w-xs">
                            <p className={clsx("text-sm italic font-serif opacity-90", theme.text)}>“{customQuote}”</p>
                        </div>
                    )}
                </div>

                {/* 2. Rank & Consistency */}
                {(options.showStats) && (
                    <div className="flex items-end justify-between px-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Rank</span>
                            <div className={clsx(
                                "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit",
                                isPremium ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg" : "bg-white/10 text-slate-300"
                            )}>
                                <Trophy className="w-3 h-3" />
                                {stats.rank}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Consistency</span>
                            <div className={clsx("text-3xl font-black leading-none", theme.accent)}>
                                {stats.consistencyScore}%
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Activity Visualization */}
                {(options.showHeatmap || options.activityType) && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 px-1">
                            <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> Activity</span>
                            <span>Last 3 Months</span>
                        </div>

                        {/* Visualization Switch */}
                        {(() => {
                            if (!stats.history || !Array.isArray(stats.history)) return null;
                            const flatHistory = stats.history.flat();
                            const maxCount = Math.max(...flatHistory.map(d => d.count)) || 1;

                            if (options.activityType === 'heatmap') {
                                return (
                                    <div className="flex gap-1 justify-between">
                                        {stats.history.map((week, wIndex) => (
                                            <div key={wIndex} className="flex flex-col gap-1">
                                                {week.map((day, dIndex) => (
                                                    <div
                                                        key={dIndex}
                                                        className={clsx(
                                                            "w-3 h-3 rounded-[3px] transition-all",
                                                            day.level === 0 ? "bg-white/5" : theme.cell,
                                                            day.level === 1 && "opacity-40",
                                                            day.level === 2 && "opacity-70",
                                                            day.level === 3 && "opacity-100"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            if (options.activityType === 'line') {
                                return (
                                    <div className="h-24 w-full bg-black/20 rounded-xl p-0 overflow-hidden relative border border-white/5">
                                        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                            {/* Gradient Fill */}
                                            <defs>
                                                <linearGradient id="graphGradient" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="currentColor" className={theme.text === 'text-slate-200' ? 'text-blue-500' : theme.text} stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="currentColor" className={theme.text === 'text-slate-200' ? 'text-blue-500' : theme.text} stopOpacity="0" />
                                                </linearGradient>
                                            </defs>

                                            <path
                                                d={`M0,50 ` + flatHistory.map((day, i, arr) => {
                                                    const x = (i / (arr.length - 1)) * 100;
                                                    const y = 50 - ((day.count / maxCount) * 40); // Leave 10px buffer
                                                    return `L${x},${y}`;
                                                }).join(" ") + ` L100,50 Z`}
                                                fill="url(#graphGradient)"
                                            />
                                            <path
                                                d={`M0,50 ` + flatHistory.map((day, i, arr) => {
                                                    const x = (i / (arr.length - 1)) * 100;
                                                    const y = 50 - ((day.count / maxCount) * 40);
                                                    return `L${x},${y}`;
                                                }).join(" ")}
                                                fill="none"
                                                strokeWidth="1.5"
                                                className={clsx(theme.text === 'text-slate-200' ? 'stroke-blue-400' : theme.accent.replace('text-', 'stroke-'))}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                );
                            }

                            // Bar Chart
                            return (
                                <div className="h-24 w-full bg-black/20 rounded-xl px-2 pb-0 pt-4 flex items-end justify-between gap-[1px] border border-white/5 relative overflow-hidden">
                                    {/* Dashed guidelines */}
                                    <div className="absolute inset-x-0 top-[25%] border-t border-dashed border-white/5" />
                                    <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-white/5" />
                                    <div className="absolute inset-x-0 top-[75%] border-t border-dashed border-white/5" />

                                    {flatHistory.map((day, i) => (
                                        <div
                                            key={i}
                                            className={clsx("w-full rounded-t-[1px]", theme.cell)}
                                            style={{
                                                height: `${Math.max((day.count / maxCount) * 100, 5)}%`, // Normalize height
                                                opacity: Math.min(0.3 + day.level * 0.2, 1)
                                            }}
                                        />
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* 4. Core Stats */}
                {options.showStats && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className={clsx("p-3 rounded-2xl border",
                            isPremium ? "bg-white/10 backdrop-blur-md border-white/20 shadow-lg" : "bg-white/5 border-white/5"
                        )}>
                            <div className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {theme.labels?.commits || (platform === 'leetcode' ? 'Problems Solved' : 'Total Commits')}
                            </div>
                            <div className="text-xl font-bold text-white">{stats.totalContributions}</div>
                        </div>
                        <div className={clsx("p-3 rounded-2xl border",
                            isPremium ? "bg-white/10 backdrop-blur-md border-white/20 shadow-lg" : "bg-white/5 border-white/5"
                        )}>
                            <div className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {theme.labels?.commits || (platform === 'leetcode' ? 'Problems Solved' : 'Total Commits')}
                            </div>
                            <div className="text-xl font-bold text-white">{stats.totalContributions}</div>
                        </div>
                        <div className={clsx("p-3 rounded-2xl border",
                            isPremium ? "bg-white/10 backdrop-blur-md border-white/20 shadow-lg" : "bg-white/5 border-white/5"
                        )}>
                            <div className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> {theme.labels?.streak || 'Best Streak'}
                            </div>
                            <div className="text-xl font-bold text-white">{stats.longestStreak} days</div>
                        </div>
                    </div>
                )}

                {/* 5. Achievements Footer */}
                {options.showBadges && (
                    <div className="mt-auto">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Unlocked Badges</div>
                        <div className="flex flex-wrap gap-2">
                            {stats.achievements.map((ach, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all hover:scale-105",
                                        isPremium
                                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 border border-yellow-500/30"
                                            : "bg-white/10 text-white border border-white/5",
                                        ach === "Consistency God" && "shadow-[0_0_10px_rgba(59,130,246,0.5)] border-blue-400/50",
                                        ach === "Git Legend" && "shadow-[0_0_10px_rgba(239,68,68,0.5)] border-red-400/50",
                                        ach === "Unstoppable" && "shadow-[0_0_10px_rgba(168,85,247,0.5)] border-purple-400/50"
                                    )}
                                >
                                    {isPremium && <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />}
                                    {ach}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Watermark */}
                {/* Footer Watermark & QR */}
                <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-auto">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-medium text-slate-600">Generated on {new Date().getFullYear()}</span>
                        <span className={clsx("font-bold text-[10px]", theme.accent)}>DevRecap.site</span>
                        {isPremium && (
                            <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                                Verified Pro
                            </span>
                        )}
                    </div>

                    <div className="bg-white p-1 rounded-md">
                        <QRCodeSVG
                            value={qrUrl}
                            size={40}
                            level={"L"}
                            bgColor="#ffffff"
                            fgColor="#000000"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
