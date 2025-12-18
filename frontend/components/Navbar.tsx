"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
        >
            <Link href="/" className="hover:opacity-80 transition">
                <Logo size={36} showText={true} />
            </Link>

            <div className="flex items-center gap-6">
                <Link href="#features" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Features</Link>
                <Link href="#hall-of-fame" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Hall of Fame</Link>
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Dashboard</Link>
                <Link href="#report-issue" className="text-sm text-slate-400 hover:text-white transition hidden md:block">Report Issue</Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                    >
                        <Github className="w-4 h-4" />
                        <span>Star</span>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
