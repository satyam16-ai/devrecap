"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Trophy, Flame, Edit3, Calendar, TrendingUp } from "lucide-react";
import RecapCard, { Stats } from "./RecapCard";

interface ThreeDCardProps {
    stats?: Stats | null;
    onEdit?: () => void;
    theme?: any;
    font?: any;
    isPremium?: boolean;
    customImage?: string | null;
    customQuote?: string;
    platform?: string;
    showWatermark?: boolean; // New Prop
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

const DEFAULT_THEME = { id: 'midnight', name: 'Midnight', bg: 'bg-gradient-to-br from-slate-900 to-slate-950', border: 'border-slate-800', text: 'text-slate-200', accent: 'text-blue-400', cell: 'bg-blue-500' };
const DEFAULT_FONT = { id: 'sans', name: 'Modern Sans', class: 'font-sans' };

export default function ThreeDCard({ stats, onEdit, theme = DEFAULT_THEME, font = DEFAULT_FONT, isPremium = false, customImage = null, customQuote = "", platform = "github", showWatermark = false, options }: ThreeDCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for rotation
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Transform mouse values to rotation degrees
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || isMobile) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[450px] h-[600px] flex items-center justify-center perspective-1000 group"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                style={{
                    rotateX: isMobile ? 0 : rotateX,
                    rotateY: isMobile ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative"
            >
                {/* Floating Elements (Background Blobs) - Hide on mobile */}
                {!isMobile && (
                    <>
                        <div
                            className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"
                            style={{ transform: "translateZ(-50px)" }}
                        />
                        <div
                            className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"
                            style={{ transform: "translateZ(-50px)" }}
                        />
                    </>
                )}

                {stats ? (
                    <div className="relative">
                        <div className="pointer-events-auto">
                            <RecapCard
                                stats={stats}
                                theme={theme}
                                font={font}
                                isPremium={isPremium}
                                customImage={customImage}
                                customQuote={customQuote}
                                platform={platform}
                                id="preview-card-3d"
                                showWatermark={showWatermark}
                                options={options}
                            />
                        </div>

                        {/* Edit Overlay */}
                        {onEdit && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm rounded-[2rem]">
                                <button
                                    onClick={onEdit}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
                                >
                                    <Edit3 className="w-5 h-5" /> Customize
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // ENHANCED SKELETON UI
                    <div className="w-[450px] min-h-[600px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-800/50 rounded-[2rem] p-8 shadow-2xl flex flex-col gap-6 overflow-hidden relative">
                        {/* Animated Background - Simplied for mobile */}
                        <div className={`absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none ${!isMobile ? 'animate-pulse' : ''}`} />

                        {/* Shimmer Effect - HIDDEN on mobile */}
                        {!isMobile && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
                                style={{
                                    animation: 'shimmer 2s infinite',
                                    backgroundSize: '200% 100%'
                                }}
                            />
                        )}

                        {/* Header Badge */}
                        <div className="flex justify-center mb-2">
                            <div className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                                <div className="h-2 w-24 bg-slate-700 rounded-full" />
                            </div>
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-800/50 shadow-xl relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Github className="w-8 h-8 text-slate-700" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-col items-center">
                                <div className="h-7 w-40 bg-slate-800 rounded-lg" />
                                <div className="h-4 w-24 bg-slate-800/60 rounded-lg" />
                            </div>
                        </div>

                        {/* Bio Box */}
                        <div className="px-4 py-3 bg-black/20 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                            <div className="space-y-2">
                                <div className="h-2.5 w-full bg-slate-800/70 rounded-full" />
                                <div className="h-2.5 w-3/4 bg-slate-800/50 rounded-full" />
                            </div>
                        </div>

                        {/* Rank & Consistency */}
                        <div className="flex items-end justify-between px-2">
                            <div className="space-y-2">
                                <div className="h-2 w-12 bg-slate-700 rounded-full" />
                                <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
                                    <div className="h-3 w-16 bg-slate-700 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Activity Heatmap - Simplified */}
                        <div className="space-y-2">
                            <div className="bg-black/20 rounded-xl p-3 border border-slate-800/30">
                                <div className="flex gap-1 justify-between">
                                    {Array.from({ length: 12 }).map((_, wIndex) => (
                                        <div key={wIndex} className="flex flex-col gap-1">
                                            {Array.from({ length: 7 }).map((_, dIndex) => (
                                                <div
                                                    key={dIndex}
                                                    className="w-2.5 h-2.5 rounded-sm bg-slate-800/60"
                                                    style={{ opacity: 0.3 }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: <Calendar className="w-3 h-3" />, label: 'Total Commits' },
                                { icon: <TrendingUp className="w-3 h-3" />, label: 'Best Streak' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/30 p-3 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-1.5 mb-2 text-slate-700">
                                        {stat.icon}
                                        <div className="h-2 w-16 bg-slate-700 rounded-full" />
                                    </div>
                                    <div className="h-5 w-12 bg-slate-700 rounded-lg" />
                                </div>
                            ))}
                        </div>

                        {/* Floating Badges - Simplified */}
                        {!isMobile && (
                            <>
                                <motion.div
                                    className="absolute top-8 right-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold border border-green-500/20 backdrop-blur-md shadow-lg"
                                    animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                        Active
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
