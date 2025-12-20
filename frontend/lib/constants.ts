export const THEMES = [
    { id: 'midnight', name: 'Midnight', bg: 'bg-gradient-to-br from-slate-900 to-slate-950', border: 'border-slate-800', text: 'text-slate-200', accent: 'text-blue-400', cell: 'bg-blue-500', isPremium: false },
    { id: 'forest', name: 'Forest', bg: 'bg-gradient-to-br from-emerald-950 to-green-950', border: 'border-emerald-500/30', text: 'text-emerald-100', accent: 'text-emerald-400', cell: 'bg-emerald-500', isPremium: false },
    { id: 'sunset', name: 'Sunset', bg: 'bg-gradient-to-br from-orange-950 to-slate-900', border: 'border-orange-500/30', text: 'text-orange-100', accent: 'text-orange-400', cell: 'bg-orange-500', isPremium: true },
    { id: 'cyberpunk', name: 'Cyberpunk', bg: 'bg-gradient-to-br from-fuchsia-950 to-purple-950', border: 'border-fuchsia-500/30', text: 'text-fuchsia-100', accent: 'text-fuchsia-400', cell: 'bg-fuchsia-500', isPremium: true },
    { id: 'crimson', name: 'Crimson', bg: 'bg-gradient-to-br from-red-950 to-slate-950', border: 'border-red-500/30', text: 'text-red-100', accent: 'text-red-400', cell: 'bg-red-500', isPremium: false },
    { id: 'aurora', name: 'Aurora', bg: 'bg-gradient-to-br from-teal-950 to-slate-900', border: 'border-teal-500/30', text: 'text-teal-100', accent: 'text-teal-400', cell: 'bg-teal-500', isPremium: false },
    { id: 'golden', name: 'Golden Hour', bg: 'bg-gradient-to-br from-yellow-950 to-amber-950', border: 'border-yellow-500/30', text: 'text-yellow-100', accent: 'text-yellow-400', cell: 'bg-yellow-500', isPremium: true },
    { id: 'ice', name: 'Glacier', bg: 'bg-gradient-to-br from-cyan-950 to-blue-950', border: 'border-cyan-500/30', text: 'text-cyan-100', accent: 'text-cyan-400', cell: 'bg-cyan-500', isPremium: false },
    { id: 'lavender', name: 'Lavender', bg: 'bg-gradient-to-br from-violet-950 to-slate-900', border: 'border-violet-500/30', text: 'text-violet-100', accent: 'text-violet-400', cell: 'bg-violet-500', isPremium: true },
    { id: 'cotton_candy', name: 'Cotton Candy', bg: 'bg-gradient-to-br from-[#2D1B2E] to-[#1F1235]', border: 'border-pink-500/30', text: 'text-pink-100', accent: 'text-pink-400', cell: 'bg-pink-500', isPremium: true },
    { id: 'matrix', name: 'The Matrix', bg: 'bg-black', border: 'border-green-500/50', text: 'text-green-400', accent: 'text-green-400', cell: 'bg-green-600', isPremium: true },
    { id: 'dracula', name: 'Vampire', bg: 'bg-gradient-to-br from-gray-900 to-red-950', border: 'border-red-900', text: 'text-gray-100', accent: 'text-red-500', cell: 'bg-red-600', isPremium: false },
    { id: 'hybrid', name: 'Dev Hybrid', bg: 'bg-gradient-to-br from-[#161b22] to-[#0d1117]', border: 'border-slate-700', text: 'text-slate-200', accent: 'text-blue-400', cell: 'bg-green-500', isPremium: false },
    { id: 'monochrome', name: 'Noir', bg: 'bg-gradient-to-br from-gray-950 to-black', border: 'border-white/20', text: 'text-white', accent: 'text-gray-400', cell: 'bg-white', isPremium: true },
    { id: 'oceanic', name: 'Deep Ocean', bg: 'bg-gradient-to-br from-[#0f172a] to-[#020617]', border: 'border-blue-500/40', text: 'text-sky-100', accent: 'text-sky-400', cell: 'bg-sky-500', isPremium: true },

    // Drop #1: High Value Premium Themes
    {
        id: 'blueprint', name: 'Architect',
        bg: 'bg-[#0F172A]', border: 'border-blue-500/50',
        text: 'text-blue-100', accent: 'text-cyan-400', cell: 'bg-cyan-500',
        isPremium: true,
        labels: { commits: 'Revisions', streak: 'Flow State' }
    },
    {
        id: 'retro', name: '8-Bit Arcade',
        bg: 'bg-[#2e1065]', border: 'border-fuchsia-500',
        text: 'text-fuchsia-200', accent: 'text-yellow-400', cell: 'bg-yellow-500',
        isPremium: true,
        labels: { commits: 'XP Earned', streak: 'Combo Streak' }
    },
    {
        id: 'neural', name: 'AI Core',
        bg: 'bg-[#09090b]', border: 'border-rose-500/40',
        text: 'text-rose-100', accent: 'text-rose-500', cell: 'bg-rose-600',
        isPremium: true,
        labels: { commits: 'Neural Links', streak: 'Uptime' }
    },

    // Drop #2: Character Themes
    {
        id: 'ronin', name: 'Ronin',
        bg: 'bg-[#1a0505]', border: 'border-red-600',
        text: 'text-red-100', accent: 'text-red-500', cell: 'bg-red-600',
        isPremium: true,
        labels: { commits: 'Fatal Strikes', streak: 'Discipline' }
    },
    {
        id: 'anime', name: 'Shonen',
        bg: 'bg-[#0f172a]', border: 'border-pink-500',
        text: 'text-pink-100', accent: 'text-cyan-400', cell: 'bg-pink-500',
        isPremium: true,
        labels: { commits: 'Power Level', streak: 'Training Arc' }
    },

    // Drop #3: Super Hero Themes
    {
        id: 'stark', name: 'Iron Tech',
        bg: 'bg-[#2a0a0a]', border: 'border-yellow-500',
        text: 'text-yellow-100', accent: 'text-yellow-400', cell: 'bg-yellow-500',
        isPremium: true,
        labels: { commits: 'Protocol Updates', streak: 'Power Output' }
    },
    {
        id: 'spidey', name: 'Web Slinger',
        bg: 'bg-[#1e0a0a]', border: 'border-red-600',
        text: 'text-blue-100', accent: 'text-red-500', cell: 'bg-red-600',
        isPremium: true,
        labels: { commits: 'Webs Spun', streak: 'Sense Tingle' }
    },
    {
        id: 'knight', name: 'Dark Knight',
        bg: 'bg-[#050505]', border: 'border-slate-700',
        text: 'text-slate-300', accent: 'text-yellow-600', cell: 'bg-yellow-700',
        isPremium: true,
        labels: { commits: 'Nights Patrolled', streak: 'Justice Served' }
    }
];

export const FONTS = [
    { id: 'sans', name: 'Standard', class: 'font-sans', isPremium: false },
    { id: 'outfit', name: 'Outfit', class: 'font-[family-name:var(--font-outfit)]', isPremium: false },
    { id: 'space', name: 'Space Grotesk', class: 'font-[family-name:var(--font-space-grotesk)]', isPremium: true },
    { id: 'fira', name: 'Fira Code', class: 'font-[family-name:var(--font-fira-code)]', isPremium: true },
    { id: 'retro', name: 'Pixel Arcade', class: 'font-[family-name:var(--font-press-start-2p)]', isPremium: true },
    { id: 'serif', name: 'Classic Serif', class: 'font-serif', isPremium: false },
    { id: 'mono', name: 'JetBrains Mono', class: 'font-mono', isPremium: true },
];
