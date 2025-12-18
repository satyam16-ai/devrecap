"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Zap, Trophy, Share2, Github, Code } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeDCard from "@/components/ThreeDCard";

import { THEMES, FONTS } from "@/lib/constants";

// Configuration for whom to fetch and how to style them
const LEGEND_CONFIG = [
  {
    username: "torvalds",
    theme: THEMES[10], // Matrix
    font: FONTS[3], // Fira Code
  },
  {
    username: "gaearon",
    theme: THEMES[9], // Cotton Candy
    font: FONTS[0], // Sans
  },
  {
    username: "gvanrossum",
    theme: THEMES[3], // Forest
    font: FONTS[2], // Space Grotesk
  }
];

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<'github' | 'leetcode'>('github');
  const [loading, setLoading] = useState(false);
  const [previewStats, setPreviewStats] = useState(null);

  // Real Hall of Fame Data
  const [legendsData, setLegendsData] = useState<any[]>([]);
  const [legendsLoading, setLegendsLoading] = useState(true);

  useEffect(() => {
    const fetchLegends = async () => {
      try {
        const promises = LEGEND_CONFIG.map(async (config) => {
          try {
            const response = await axios.get("http://localhost:5000/api/stats", {
              params: { username: config.username, platform: 'github' }
            });
            // Merge actual data with our styling config
            return {
              ...response.data,
              theme: config.theme,
              font: config.font,
              customImage: null
            };
          } catch (err) {
            console.error(`Failed to fetch legend: ${config.username}`, err);
            return null; // Skip failed ones
          }
        });

        const results = await Promise.all(promises);
        setLegendsData(results.filter(Boolean)); // Filter out nulls
      } catch (error) {
        console.error("Error fetching legends:", error);
      } finally {
        setLegendsLoading(false);
      }
    };

    fetchLegends();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);

    // Mobile check to skip preview and go straight to editor
    const isMobile = window.innerWidth < 768; // standard md breakpoint

    if (isMobile) {
      router.push(`/dashboard?username=${username}&platform=${platform}`);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/stats", {
        params: { username, platform }
      });
      // Attach platform to response data for preview mapping
      setPreviewStats({ ...response.data, platform });
    } catch (err) {
      console.error(err);
      alert("User not found or error fetching stats.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (username) {
      router.push(`/dashboard?username=${username}&platform=${platform}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center relative gap-8 lg:gap-12">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          {/* Left Column: Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-700/50 rounded-full text-sm text-slate-300 mb-6 backdrop-blur-sm self-center lg:self-start"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span>v2.0 Now Available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
            >
              <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                Your Dev Story,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Summarized.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed"
            >
              Stop sharing boring GitHub links. Generate a
              <span className="text-white font-semibold"> professional developer card </span>
              with your stats, achievements, and coding personality.
            </motion.p>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-md relative group z-10"
            >
              {/* Platform Switcher */}
              <div className="flex justify-center mb-6">
                <div className="bg-slate-900/50 p-1 rounded-full border border-slate-800 flex relative">
                  <motion.div
                    className="absolute top-1 bottom-1 bg-slate-700/50 rounded-full"
                    initial={false}
                    animate={{
                      left: platform === 'github' ? '4px' : '50%',
                      width: 'calc(50% - 4px)'
                    }}
                  />
                  <button
                    onClick={() => setPlatform('github')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${platform === 'github' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    GitHub
                  </button>
                  <button
                    onClick={() => setPlatform('leetcode')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${platform === 'leetcode' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    LeetCode
                  </button>
                </div>
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="relative flex bg-slate-950 rounded-full p-2 border border-slate-800 shadow-2xl">
                  {platform === 'github' ? (
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  ) : (
                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
                  )}
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`${platform === 'github' ? 'GitHub' : 'LeetCode'} Username`}
                    className="flex-1 bg-transparent border-none outline-none pl-12 pr-6 text-white placeholder-slate-600 font-medium h-12"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[1px] h-14 w-full mt-4 overflow-hidden group shadow-lg shadow-purple-500/25"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#312E81_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative h-full w-full bg-slate-950 rounded-full flex items-center justify-center gap-2 group-hover:bg-slate-900 transition-colors duration-300">
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 text-white" />
                    ) : (
                      <>
                        <span className="font-bold text-white tracking-wide">Generate Recap</span>
                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Right Column: 3D Card */}
          <div className="flex-1 w-full flex justify-center lg:justify-end hidden md:flex z-0 pointer-events-auto relative">
            <div className="scale-[0.65] lg:scale-[0.85] origin-top md:origin-center lg:origin-top-right transition-transform duration-500">
              <ThreeDCard stats={previewStats} onEdit={handleEdit} />
            </div>
          </div>
        </div>

        {/* LEGENDS SECTION */}
        <div id="hall-of-fame" className="w-full mt-24 mb-12 relative scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
              Hall of Fame
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              See how the legends of open source look on DevRecap. unique styles for unique minds.
            </p>
          </div>

          {/* Static Hall of Fame Grid */}
          <div className="w-full flex justify-center px-4 pb-20 pt-4">
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-12 w-full max-w-7xl">
              {legendsLoading ? (
                // Loading Skeletons
                [1, 2, 3].map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ zoom: 0.65 }}>
                    <div className="w-[450px] h-[600px] bg-slate-900 rounded-[2rem] border border-slate-800" />
                  </div>
                ))
              ) : (
                legendsData.map((legend, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    {/* 
                        Using zoom: 0.65 for sharp rendering on Windows screens.
                        The wrapper ensures the layout respects the zoomed size.
                    */}
                    <div
                      className="relative cursor-pointer transition-transform duration-500 hover:-translate-y-2"
                      style={{ zoom: 0.65 }}
                    >
                      <ThreeDCard
                        stats={legend as any}
                        theme={legend.theme}
                        font={legend.font}
                        isPremium={true}
                        customImage={null}
                        options={{
                          showAvatar: true, showBio: true, showHeatmap: true, showStats: true, showBadges: true, qrType: 'github', activityType: 'heatmap'
                        }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full text-left scroll-mt-24">
          {[
            { title: "Smart Analysis", desc: "We analyze your commit times, languages, and streaks to find your coding persona.", icon: <Zap className="w-6 h-6 text-yellow-400" /> },
            { title: "Visual Wrapper", desc: "Turn raw data into beautiful, shareable images for Twitter and LinkedIn.", icon: <Share2 className="w-6 h-6 text-blue-400" /> },
            { title: "Gamification", desc: "Unlock achievements like 'Night Owl' and earn rankings based on consistency.", icon: <Trophy className="w-6 h-6 text-purple-400" /> },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition duration-300"
            >
              <div className="mb-4 bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
