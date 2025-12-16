interface LogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export default function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo Icon */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                {/* Gradient Definitions */}
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                </defs>

                {/* Background Circle with Glow */}
                <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.1" />

                {/* Code Bracket Left */}
                <path
                    d="M 30 25 L 20 25 Q 15 25 15 30 L 15 70 Q 15 75 20 75 L 30 75"
                    stroke="url(#logoGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Code Bracket Right */}
                <path
                    d="M 70 25 L 80 25 Q 85 25 85 30 L 85 70 Q 85 75 80 75 L 70 75"
                    stroke="url(#logoGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Activity Graph Bars - Center */}
                <g opacity="0.9">
                    <rect x="35" y="55" width="6" height="20" rx="2" fill="url(#accentGradient)" />
                    <rect x="44" y="45" width="6" height="30" rx="2" fill="url(#accentGradient)" />
                    <rect x="53" y="38" width="6" height="37" rx="2" fill="url(#accentGradient)" />
                    <rect x="62" y="50" width="6" height="25" rx="2" fill="url(#accentGradient)" />
                </g>

                {/* Sparkle/Star Accent */}
                <circle cx="75" cy="30" r="3" fill="#3B82F6" opacity="0.8" />
                <circle cx="25" cy="35" r="2" fill="#8B5CF6" opacity="0.6" />
            </svg>

            {/* Text Logo */}
            {showText && (
                <div className="flex flex-col leading-none">
                    <span className="font-black text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        DevRecap
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
                        .site
                    </span>
                </div>
            )}
        </div>
    );
}
