import React from "react";
import { Trophy, Flame, Calendar, Info, Zap, Skull, Crown } from "lucide-react";
import clsx from "clsx";
import { Stats } from "./RecapCard";

interface BattleCardProps {
    p1: Stats;
    p2: Stats;
    theme: { id: string; bg: string; border: string; text: string; accent: string };
    font: { id: string; class: string };
}

export default function BattleCard({ p1, p2, theme, font }: BattleCardProps) {
    // Helper to calculate winner of a specific stat
    const getWinner = (val1: number, val2: number) => {
        if (val1 > val2) return "p1";
        if (val2 > val1) return "p2";
        return "tie";
    };

    const winners = {
        contributions: getWinner(p1.totalContributions, p2.totalContributions),
        streak: getWinner(p1.longestStreak, p2.longestStreak),
        consistency: getWinner(p1.consistencyScore || 0, p2.consistencyScore || 0),
    };

    // Calculate Total Score (Simple weighted sum)
    const score1 = (p1.totalContributions * 1) + (p1.longestStreak * 10) + ((p1.consistencyScore || 0) * 20);
    const score2 = (p2.totalContributions * 1) + (p2.longestStreak * 10) + ((p2.consistencyScore || 0) * 20);
    const winner = score1 > score2 ? "p1" : score2 > score1 ? "p2" : "tie";

    return (
        <div
            id="battle-card"
            className={clsx(
                "relative w-[800px] h-[600px] rounded-[2rem] overflow-hidden flex shadow-2xl transition-all duration-300",
                theme.bg,
                `border-4 ${theme.border}`,
                font.class
            )}
        >
            {/* Background Texture (shared) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60 pointer-events-none z-10" />

            {/* VS Divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-500 to-transparent z-20 shadow-[0_0_20px_rgba(234,179,8,0.5)] transform -translate-x-1/2 rotate-12" />

            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 animate-pulse" />
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-2xl rotate-[-12deg] hover:rotate-0 transition-transform duration-300 scale-125">
                        <span className="text-4xl font-black text-white italic drop-shadow-lg font-mono">VS</span>
                    </div>
                </div>
            </div>

            {/* PLAYER 1 SECTION (LEFT) */}
            <div className={`relative w-1/2 h-full p-8 flex flex-col justify-between ${winner === 'p1' ? 'bg-blue-500/5' : ''}`}>
                {/* Winner Glow */}
                {winner === 'p1' && <div className="absolute inset-0 bg-blue-500/10 animate-pulse z-0" />}

                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                        <img src={p1.avatarUrl} className="w-24 h-24 rounded-2xl border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] object-cover" />
                        {winner === 'p1' && <div className="absolute -top-6 -left-4 text-4xl animate-bounce">👑</div>}
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-white uppercase tracking-tighter text-center">{p1.name || p1.username}</h2>
                    <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Player 1</span>

                    {/* Stats Grid */}
                    <div className="mt-12 space-y-6 w-full">
                        <div className={clsx("p-4 rounded-xl border flex justify-between items-center transition-all", winners.contributions === 'p1' ? "bg-blue-500/20 border-blue-500 shadow-lg scale-105" : "bg-white/5 border-white/10 opacity-70")}>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase text-slate-400 font-bold">Commits</span>
                                <span className="text-2xl font-black text-white">{p1.totalContributions}</span>
                            </div>
                            {winners.contributions === 'p1' && <Flame className="w-6 h-6 text-orange-500" />}
                        </div>
                        <div className={clsx("p-4 rounded-xl border flex justify-between items-center transition-all", winners.streak === 'p1' ? "bg-blue-500/20 border-blue-500 shadow-lg scale-105" : "bg-white/5 border-white/10 opacity-70")}>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase text-slate-400 font-bold">Streak</span>
                                <span className="text-2xl font-black text-white">{p1.longestStreak}</span>
                            </div>
                            {winners.streak === 'p1' && <Zap className="w-6 h-6 text-yellow-400" />}
                        </div>
                        <div className={clsx("p-4 rounded-xl border flex justify-between items-center transition-all", winners.consistency === 'p1' ? "bg-blue-500/20 border-blue-500 shadow-lg scale-105" : "bg-white/5 border-white/10 opacity-70")}>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase text-slate-400 font-bold">Consistency</span>
                                <span className="text-2xl font-black text-white">{p1.consistencyScore}%</span>
                            </div>
                            {winners.consistency === 'p1' && <Trophy className="w-6 h-6 text-purple-400" />}
                        </div>
                    </div>
                </div>

                {/* Footer Score */}
                <div className="relative z-10 text-center">
                    <span className="text-6xl font-black text-white/10">{Math.round(score1)}</span>
                </div>
            </div>

            {/* PLAYER 2 SECTION (RIGHT) */}
            <div className={`relative w-1/2 h-full p-8 flex flex-col justify-between items-end ${winner === 'p2' ? 'bg-red-500/5' : ''}`}>
                {/* Winner Glow */}
                {winner === 'p2' && <div className="absolute inset-0 bg-red-500/10 animate-pulse z-0" />}

                <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="relative">
                        <img src={p2.avatarUrl} className="w-24 h-24 rounded-2xl border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] object-cover" />
                        {winner === 'p2' && <div className="absolute -top-6 -right-4 text-4xl animate-bounce">👑</div>}
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-white uppercase tracking-tighter text-center">{p2.name || p2.username}</h2>
                    <span className="text-sm font-bold text-red-400 uppercase tracking-widest">Player 2</span>

                    {/* Stats Grid */}
                    <div className="mt-12 space-y-6 w-full">
                        <div className={clsx("p-4 rounded-xl border flex flex-row-reverse justify-between items-center text-right transition-all", winners.contributions === 'p2' ? "bg-red-500/20 border-red-500 shadow-lg scale-105" : "bg-white/5 border-white/10 opacity-70")}>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase text-slate-400 font-bold">Commits</span>
                                <span className="text-2xl font-black text-white">{p2.totalContributions}</span>
                            </div>
                            {winners.contributions === 'p2' && <Flame className="w-6 h-6 text-orange-500" />}
                        </div>
                        <div className={clsx("p-4 rounded-xl border flex flex-row-reverse justify-between items-center text-right transition-all", winners.streak === 'p2' ? "bg-red-500/20 border-red-500 shadow-lg scale-105" : "bg-white/5 border-white/10 opacity-70")}>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase text-slate-400 font-bold">Streak</span>
                                <span className="text-2xl font-black text-white">{p2.longestStreak}</span>
                            </div>
                            {winners.streak === 'p2' && <Zap className="w-6 h-6 text-yellow-400" />}
                        </div>
                        <div className={clsx("p-4 rounded-xl border flex flex-row-reverse justify-between items-center text-right transition-all", winners.consistency === 'p2' ? "bg-red-500/20 border-red-500 shadow-lg scale-105" : "bg-white/5 border-white/10 opacity-70")}>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase text-slate-400 font-bold">Consistency</span>
                                <span className="text-2xl font-black text-white">{p2.consistencyScore}%</span>
                            </div>
                            {winners.consistency === 'p2' && <Trophy className="w-6 h-6 text-purple-400" />}
                        </div>
                    </div>
                </div>

                {/* Footer Score */}
                <div className="relative z-10 text-center w-full">
                    <span className="text-6xl font-black text-white/10">{Math.round(score2)}</span>
                </div>
            </div>

            {/* Winner Overlay Text */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap">
                <div className="px-6 py-2 bg-yellow-500 text-black font-black uppercase tracking-[0.3em] rounded-full shadow-lg scale-125">
                    {winner === 'p1' ? `${p1.username} WINS` : winner === 'p2' ? `${p2.username} WINS` : 'DRAW GAME'}
                </div>
            </div>
        </div>
    );
}
