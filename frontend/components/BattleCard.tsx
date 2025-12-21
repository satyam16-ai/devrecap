import React from "react";
import { Trophy, Crown, Flame, Calendar, TrendingUp, Sparkles, Swords } from "lucide-react";
import clsx from "clsx";
import { Stats } from "./RecapCard";
import { QRCodeSVG } from 'qrcode.react';

interface BattleCardProps {
    p1: Stats;
    p2: Stats;
    winner: 'p1' | 'p2' | 'tie';
    theme: any;
    font?: any;
    customImage?: string | null;
    isPremium?: boolean;
}

export default function BattleCard({ p1, p2, winner, theme, font, customImage, isPremium = false }: BattleCardProps) {
    // Helper to calculate score for internal weighting if needed, 
    // but the winner is passed in props to allow parent control.

    const StatRow = ({ icon: Icon, label, v1, v2, highlight = 'higher' }: { icon: any, label: string, v1: string | number, v2: string | number, highlight?: 'higher' | 'lower' | 'none' }) => {
        let isV1Better = false;
        let isV2Better = false;

        if (highlight !== 'none') {
            // Convert to numbers for comparison if possible
            const n1 = typeof v1 === 'string' ? parseFloat(v1.replace(/[^0-9.-]+/g, "")) : v1;
            const n2 = typeof v2 === 'string' ? parseFloat(v2.replace(/[^0-9.-]+/g, "")) : v2;

            if (!isNaN(n1 as number) && !isNaN(n2 as number)) {
                if (highlight === 'higher') {
                    isV1Better = (n1 as number) > (n2 as number);
                    isV2Better = (n2 as number) > (n1 as number);
                }
            }
        }

        return (
            <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className={clsx("font-bold text-sm w-16 text-center", isV1Better ? "text-green-400" : "text-slate-400")}>{v1}</div>
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-[9px] uppercase font-bold text-slate-600 tracking-wider">{label}</span>
                </div>
                <div className={clsx("font-bold text-sm w-16 text-center", isV2Better ? "text-green-400" : "text-slate-400")}>{v2}</div>
            </div>
        );
    };

    return (
        <div
            id="battle-card"
            className={clsx(
                "relative w-[600px] min-h-[500px] rounded-[3rem] overflow-hidden p-8 flex flex-col shadow-2xl transition-all duration-300",
                theme.bg,
                isPremium ? "border-4 border-yellow-500/50 shadow-yellow-500/20" : `border-4 ${theme.border}`,
                font?.class
            )}
        >
            {/* Custom Background Image */}
            {customImage && (
                <div className="absolute inset-0 z-0">
                    <img src={customImage} alt="Background" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-black/40" /> {/* Dimmer */}
                </div>
            )}

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none">
                {/* Diagonal Split/Glow can go here */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            {/* Header */}
            <div className="relative z-10 text-center mb-8">
                <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-black/30 border border-white/10 backdrop-blur-md mb-2">
                    <Swords className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-black uppercase tracking-widest text-white">Versus Battle</span>
                </div>
            </div>

            {/* Players Area */}
            <div className="relative z-10 flex justify-between items-start mb-8">
                {/* Player 1 */}
                <div className="flex flex-col items-center w-1/3 relative group">
                    <div className="relative mb-4">
                        <div className={clsx(
                            "w-24 h-24 rounded-full border-4 object-cover shadow-xl",
                            winner === 'p1' ? "border-yellow-400 shadow-yellow-500/50" : "border-slate-700"
                        )}>
                            <img src={p1.avatarUrl} alt={p1.username} className="w-full h-full rounded-full" />
                        </div>
                        {winner === 'p1' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                                <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                            </div>
                        )}
                        {winner === 'p1' && (
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-full uppercase tracking-wider shadow-lg">
                                Winner
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white truncate max-w-full">{p1.username}</h3>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">{p1.rank} Rank</p>
                </div>

                {/* VS Badge */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center font-black italic text-2xl text-white border-4 border-[#0f1016] shadow-xl transform group-hover:scale-110 transition-transform">
                        VS
                    </div>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center w-1/3 relative">
                    <div className="relative mb-4">
                        <div className={clsx(
                            "w-24 h-24 rounded-full border-4 object-cover shadow-xl",
                            winner === 'p2' ? "border-yellow-400 shadow-yellow-500/50" : "border-slate-700"
                        )}>
                            <img src={p2.avatarUrl} alt={p2.username} className="w-full h-full rounded-full" />
                        </div>
                        {winner === 'p2' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                                <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                            </div>
                        )}
                        {winner === 'p2' && (
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-full uppercase tracking-wider shadow-lg">
                                Winner
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white truncate max-w-full">{p2.username}</h3>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">{p2.rank} Rank</p>
                </div>
            </div>

            {/* Stats Comparison Grid */}
            <div className="relative z-10 space-y-3 w-full max-w-md mx-auto">
                <StatRow
                    icon={Calendar}
                    label="Commits"
                    v1={p1.totalContributions}
                    v2={p2.totalContributions}
                />
                <StatRow
                    icon={TrendingUp}
                    label="Max Streak"
                    v1={`${p1.longestStreak}`}
                    v2={`${p2.longestStreak}`}
                />
                <StatRow
                    icon={Flame}
                    label="Active Days"
                    v1={p1.activeDays}
                    v2={p2.activeDays}
                />
                <StatRow
                    icon={Trophy}
                    label="Consistency"
                    v1={`${p1.consistencyScore}%`}
                    v2={`${p2.consistencyScore}%`}
                />
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 flex justify-between items-end border-t border-white/5 opacity-80">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Generated on DevRecap</span>
                    <span className="text-xs font-black text-white tracking-widest">DEVRECAP.SITE</span>
                </div>
                <div className="bg-white p-1 rounded-lg">
                    <QRCodeSVG value="https://devrecap.site/battle" size={40} />
                </div>
            </div>
        </div>
    );
}
