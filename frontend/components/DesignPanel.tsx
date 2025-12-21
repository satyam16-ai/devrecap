"use client";

import React, { useRef } from 'react';
import { Palette, Type, Upload, Star, Trophy, Flame, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { THEMES, FONTS } from '@/lib/constants';

interface DesignPanelProps {
    activeTheme: any;
    setActiveTheme: (theme: any) => void;
    activeFont: any;
    setActiveFont: (font: any) => void;
    customImage: string | null;
    setCustomImage: (img: string | null) => void;
    isPremium: boolean;
    setIsPremium: (v: boolean) => void;
}

export function DesignPanel({
    activeTheme, setActiveTheme,
    activeFont, setActiveFont,
    customImage, setCustomImage,
    isPremium, setIsPremium
}: DesignPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
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
                                {theme.isPremium && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 ml-auto" />}
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
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {FONTS.map(font => (
                        <button
                            key={font.id}
                            onClick={() => setActiveFont(font)}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm border transition-all whitespace-nowrap flex items-center gap-2",
                                activeFont.id === font.id
                                    ? "bg-slate-800 border-white text-white"
                                    : "bg-slate-950/50 border-slate-800 text-slate-400"
                            )}
                        >
                            {font.name}
                            {font.isPremium && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
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
}
