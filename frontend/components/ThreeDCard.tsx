"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Trophy, Flame, Edit3 } from "lucide-react";
import RecapCard, { Stats } from "./RecapCard";

interface ThreeDCardProps {
    stats?: Stats | null;
    onEdit?: () => void;
    theme?: any;
    font?: any;
    isPremium?: boolean;
    customImage?: string | null;
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

export default function ThreeDCard({ stats, onEdit, theme = DEFAULT_THEME, font = DEFAULT_FONT, isPremium = false, customImage = null, options }: ThreeDCardProps) {
    const ref = useRef<HTMLDivElement>(null);

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
        if (!ref.current) return;

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
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative"
            >
                {/* Floating Elements (Background Blobs) */}
                <div
                    className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"
                    style={{ transform: "translateZ(-50px)" }}
                />
                <div
                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"
                    style={{ transform: "translateZ(-50px)" }}
                />

                {stats ? (
                    <div className="relative">
                        <div className="pointer-events-none">
                            <RecapCard
                                stats={stats}
                                theme={theme}
                                font={font}
                                isPremium={isPremium}
                                customImage={customImage}
                                id="preview-card-3d"
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
                    // SKELETON UI
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 overflow-hidden">
                        {/* Glass Reflection Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                        {/* Header Skeleton */}
                        <div className="flex flex-col items-center gap-4 mt-4">
                            <div className="w-20 h-20 rounded-full bg-slate-800 animate-pulse border-2 border-slate-700 shadow-lg relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                            </div>
                            <div className="w-3/4 h-6 bg-slate-800 rounded-full animate-pulse" />
                            <div className="w-1/2 h-4 bg-slate-800/50 rounded-full animate-pulse" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse p-3 border border-slate-700/30 flex flex-col justify-end gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800/80" />
                                    <div className="w-12 h-3 bg-slate-700/50 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Heatmap Skeleton */}
                        <div className="flex-1 bg-slate-800/30 rounded-2xl p-3 border border-slate-700/30 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Flame className="w-4 h-4 text-slate-700" />
                                <div className="w-20 h-3 bg-slate-700/50 rounded-full" />
                            </div>
                            <div className="flex-1 grid grid-cols-7 gap-1 content-start">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-sm bg-slate-800 animate-pulse"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Floating UI Elements (Parallax) */}
                        <motion.div
                            className="absolute top-10 right-8 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-md"
                            style={{ transform: "translateZ(30px)" }}
                        >
                            Online
                        </motion.div>

                        <motion.div
                            className="absolute bottom-20 -left-6 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl shadow-xl flex items-center gap-3 border border-white/10"
                            style={{ transform: "translateZ(50px)" }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <Trophy className="w-6 h-6 text-yellow-300" />
                            <div>
                                <div className="w-20 h-2 bg-white/20 rounded-full mb-1" />
                                <div className="w-12 h-2 bg-white/10 rounded-full" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute top-40 -right-8 bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2"
                            style={{ transform: "translateZ(40px)" }}
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                        >
                            <Github className="w-5 h-5 text-white" />
                            <div className="w-8 h-2 bg-slate-600 rounded-full" />
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
