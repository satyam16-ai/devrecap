"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Zap, Trophy, Share2, Github, Code, AlertCircle, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeDCard from "@/components/ThreeDCard";
import OfferPopup from "@/components/OfferPopup";

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

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};


export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<'github' | 'leetcode'>('github');
  const [loading, setLoading] = useState(false);
  const [previewStats, setPreviewStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Real Hall of Fame Data
  const [legendsData, setLegendsData] = useState<any[]>([]);
  const [legendsLoading, setLegendsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / (legendsData.length || 3);
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = container.scrollWidth / (legendsData.length || 3);
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchLegends = async () => {
      try {
        // v=3 ensures we bypass any stale cached response and get fresh data with new token
        const response = await axios.get("/api/hall-of-fame?v=3");
        // Add font config locally since it's UI-specific
        const legendsWithFonts = response.data.map((item: any) => ({
          ...item,
          font: "Inter",
          customImage: null
        }));
        setLegendsData(legendsWithFonts);
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
      const response = await axios.get("/api/stats", {
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
    <div className="min-h-screen bg-slate-950 text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 overflow-x-hidden relative">
      <OfferPopup />
      <Navbar />

      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[60px] md:blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[60px] md:blur-[120px] animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      {/* Hero Section */}
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center relative gap-8 lg:gap-12">

        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-700/50 rounded-full text-sm text-slate-300 mb-6 backdrop-blur-sm self-center lg:self-start hover:border-blue-500/50 transition-colors cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>v2.0 Now Available</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
            >
              <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                Your Dev Story,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_4s_ease_infinite]">
                Summarized.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed"
            >
              Stop sharing boring GitHub links. Generate a
              <span className="text-white font-semibold relative inline-block mx-1">
                professional developer card
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500/50"></span>
              </span>
              with your stats, achievements, and coding personality.
            </motion.p>

            {/* Input Form */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-md relative group z-10"
            >
              {/* Platform Switcher */}
              <div className="flex justify-center mb-6 relative z-20">
                <div className="bg-slate-900/80 p-1.5 rounded-full border border-slate-800 flex relative backdrop-blur-md shadow-inner">
                  <motion.div
                    className="absolute top-1.5 bottom-1.5 bg-slate-700 rounded-full shadow-md"
                    initial={false}
                    animate={{
                      left: platform === 'github' ? '6px' : '50%',
                      width: 'calc(50% - 6px)',
                      x: platform === 'github' ? 0 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <button
                    type="button"
                    onClick={() => setPlatform('github')}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${platform === 'github' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    GitHub
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform('leetcode')}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${platform === 'leetcode' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    LeetCode
                  </button>
                </div>
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200 pointer-events-none"></div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full relative">
                <div className="relative flex bg-slate-950 rounded-full p-2 border border-slate-800 shadow-2xl transition-all focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20">
                  {platform === 'github' ? (
                    <Github className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  ) : (
                    <Code className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 w-5 h-5" />
                  )}
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`${platform === 'github' ? 'GitHub' : 'LeetCode'} Username`}
                    className="flex-1 bg-transparent border-none outline-none pl-14 pr-6 text-white placeholder-slate-500 font-medium h-12"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[1px] h-14 w-full mt-2 overflow-hidden group shadow-lg shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
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
          </motion.div>

          {/* Right Column: 3D Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex-1 w-full flex justify-center lg:justify-end hidden md:flex z-0 pointer-events-auto relative perspective-[2000px]"
          >
            <motion.div
              variants={isMobile ? {} : floatVariants}
              initial="initial"
              animate="animate"
              className="scale-[0.65] lg:scale-[0.85] origin-top md:origin-center lg:origin-top-right relative z-10"
            >
              {/* 3D Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 blur-[100px] opacity-20 -z-10 rounded-full"></div>
              <ThreeDCard stats={previewStats} onEdit={handleEdit} />
            </motion.div>
          </motion.div>
        </div>

        {/* LEGENDS SECTION */}
        <div id="hall-of-fame" className="w-full mt-32 mb-12 relative scroll-mt-24">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4"
            >
              Hall of Fame
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-xl mx-auto"
            >
              See how the legends of open source look on DevRecap. Unique styles for unique minds.
            </motion.p>
          </div>

          <div className="w-full flex justify-center px-0 md:px-4 pb-20 pt-0">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex flex-row flex-nowrap overflow-x-auto overflow-y-hidden snap-x snap-mandatory items-center justify-start gap-6 md:gap-12 w-full max-w-7xl no-scrollbar px-8 md:px-0 py-24 md:py-12 min-h-[450px] md:min-h-[550px]"
            >
              {legendsLoading ? (
                // Loading Skeletons
                [1, 2, 3].map((_, i) => (
                  <div key={i} className="animate-pulse opacity-50 shrink-0 snap-center scale-[0.6] md:scale-[0.65]">
                    <div className="w-[450px] h-[600px] bg-slate-900 rounded-[2rem] border border-slate-800" />
                  </div>
                ))
              ) : (
                legendsData.map((legend, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.15, type: "spring", damping: 20 }}
                    className="relative group shrink-0 snap-center"
                  >
                    <div
                      className="relative cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] scale-[0.6] md:scale-[0.65]"
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

          {/* Dots Navigation */}
          {!legendsLoading && legendsData.length > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              {legendsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i
                    ? "w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "w-2 bg-slate-700 hover:bg-slate-600"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
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
              whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm transition-all duration-300 group"
            >
              <div className="mb-4 bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Report an Issue Section */}
        <motion.div
          id="report-issue"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 w-full scroll-mt-24"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-red-500/20 p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),transparent_50%)]" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 mb-6"
              >
                <AlertCircle className="w-8 h-8 text-red-400" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Found a Bug?
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Help us improve DevRecap! Report issues, suggest features, or contribute to making this tool better for everyone.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://github.com/satyam16-ai/devrecap/issues/new"
                  target="_blank"
                  className="group flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
                >
                  <Github className="w-5 h-5" />
                  <span>Report on GitHub</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="mailto:satyamtiwari567890@gmail.com"
                  className="group flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 border border-slate-700"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Us</span>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Quick Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Community Driven</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
