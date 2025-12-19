import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubData } from '../../../lib/services/github.service';
import { fetchLeetCodeData } from '../../../lib/services/leetcode.service';

// Simple in-memory cache with TTL
interface CacheEntry {
    data: any;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

function getCachedData(key: string): any | null {
    const entry = cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > CACHE_TTL) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

function setCachedData(key: string, data: any): void {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });

    // Clean up old entries (LRU-like behavior)
    if (cache.size > 1000) {
        const firstKey = cache.keys().next().value as string;
        if (firstKey) cache.delete(firstKey);
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const platform = searchParams.get('platform') || 'github';

    if (!username) {
        return NextResponse.json(
            { error: 'Username parameter is required.' },
            { status: 400 }
        );
    }

    // Create cache key
    const cacheKey = `${platform}:${username}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        console.log(`Cache HIT for ${cacheKey}`);
        return NextResponse.json(cachedData, {
            headers: {
                'X-Cache-Status': 'HIT',
                'Cache-Control': 'public, s-maxage=28800, stale-while-revalidate=86400'
            }
        });
    }

    console.log(`Cache MISS for ${cacheKey}`);

    try {
        let stats;

        if (platform === 'leetcode') {
            stats = await handleLeetCode(username);
        } else {
            const token = request.headers.get('authorization')?.split(' ')[1];
            stats = await handleGitHub(username, token);
        }

        // Cache the successful response
        setCachedData(cacheKey, stats);

        return NextResponse.json(stats, {
            headers: {
                'X-Cache-Status': 'MISS',
                'Cache-Control': 'public, s-maxage=28800, stale-while-revalidate=86400'
            }
        });

    } catch (error: any) {
        console.error('Stats Error:', error.message || error);

        const debugInfo = {
            hasEnvToken: !!process.env.GITHUB_TOKEN,
            envTokenLength: process.env.GITHUB_TOKEN?.length || 0,
            nodeEnv: process.env.NODE_ENV
        };

        // Handle user-friendly errors
        if (error.userFriendly) {
            return NextResponse.json(
                {
                    error: error.message,
                    debug: debugInfo,
                    originalError: error.originalError
                },
                { status: error.statusCode || 500 }
            );
        }

        // Generic fallback
        return NextResponse.json(
            {
                error: 'Something went wrong while fetching your stats. Please try again later.',
                debug: debugInfo,
                details: error.message,
                originalError: error.originalError || error.response?.data
            },
            { status: 500 }
        );
    }
}

import { processGitHubStats } from '@/lib/utils/stats-processor';

// ... (imports)

async function handleGitHub(username: string, token?: string) {
    // Get token from environment if not provided, trim whitespace AND remove quotes
    let githubToken = (token || process.env.GITHUB_TOKEN || '').trim();
    if (githubToken.startsWith('"') && githubToken.endsWith('"')) {
        githubToken = githubToken.slice(1, -1);
    }
    if (githubToken.startsWith("'") && githubToken.endsWith("'")) {
        githubToken = githubToken.slice(1, -1);
    }

    console.log('Environment check:', {
        hasToken: !!token,
        hasEnvToken: !!process.env.GITHUB_TOKEN,
        tokenLength: githubToken?.length || 0
    });

    const data = await fetchGitHubData(username, githubToken);

    if (!data) {
        const error: any = new Error(`We couldn't find a GitHub user named "${username}". Please double-check the spelling and try again.`);
        error.statusCode = 404;
        error.userFriendly = true;
        throw error;
    }

    const processedData = processGitHubStats(data);

    if (!processedData) {
        const error: any = new Error(
            `No GitHub activity found for ${username} this year. ` +
            `Try making some commits or contributions, then come back to create your recap! 🚀`
        );
        error.statusCode = 404;
        error.userFriendly = true;
        throw error;
    }

    return processedData;
}

async function handleLeetCode(username: string) {
    const data = await fetchLeetCodeData(username);

    if (!data) {
        const error: any = new Error(
            `We couldn't find a LeetCode user named "${username}". Please double-check the spelling and try again.`
        );
        error.statusCode = 404;
        error.userFriendly = true;
        throw error;
    }

    // Process LeetCode Data
    const { submitStats, submissionCalendar, profile } = data;
    const calendar = JSON.parse(submissionCalendar || '{}');

    let totalSubmissions = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);
    const dayMap = new Map<string, number>();

    timestamps.forEach(ts => {
        const date = new Date(ts * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const count = calendar[ts];
        dayMap.set(dateStr, count);
        totalSubmissions += count;
        activeDays++;
    });

    // Streak Calculation
    let streak = 0;
    let prevDateStr = '';

    timestamps.forEach(ts => {
        const date = new Date(ts * 1000);
        const dateStr = date.toISOString().split('T')[0];

        if (prevDateStr) {
            const prev = new Date(prevDateStr);
            const diffTime = Math.abs(date.getTime() - prev.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
            } else {
                streak = 1;
            }
        } else {
            streak = 1;
        }

        if (streak > longestStreak) longestStreak = streak;
        prevDateStr = dateStr;
    });

    const consistencyScore = timestamps.length > 0 ? Math.min(100, Math.round((activeDays / 365) * 100 + (longestStreak / 2))) : 0;

    // Generate Heatmap (Last 15 weeks like GitHub)
    const history = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (14 * 7));

    for (let w = 0; w < 15; w++) {
        const weekData = [];
        for (let d = 0; d < 7; d++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + (w * 7) + d);
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = dayMap.get(dateStr) || 0;

            weekData.push({
                count: count,
                level: count === 0 ? 0 : count < 2 ? 1 : count < 5 ? 2 : 3
            });
        }
        history.push(weekData);
    }

    // Achievements
    const achievements: string[] = [];
    const totalSolved = submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'All')?.count || 0;
    const hardSolved = submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'Hard')?.count || 0;
    const medSolved = submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'Medium')?.count || 0;

    if (totalSolved > 500) achievements.push("Problem Solver");
    if (hardSolved > 50) achievements.push("Hard Hitter");
    if (hardSolved > 100) achievements.push("Algorithm God");
    if (medSolved > 200) achievements.push("Consistent Coder");
    if (profile.ranking < 100000) achievements.push("Top 100k");
    if (profile.ranking < 10000) achievements.push("Elite coder");
    if (longestStreak > 30) achievements.push("Daily Grinder");

    if (achievements.length === 0) achievements.push("Newbie");

    const smartBio = `Rank #${profile.ranking.toLocaleString()} on LeetCode. Solved ${totalSolved} problems.`;

    // Determine rank
    let rank = "Bronze";
    if (totalSolved > 500) rank = "Diamond";
    else if (totalSolved > 200) rank = "Platinum";
    else if (totalSolved > 100) rank = "Gold";
    else if (totalSolved > 50) rank = "Silver";

    return {
        username: data.username,
        name: profile.realName || data.username,
        avatarUrl: profile.userAvatar || 'https://assets.leetcode.com/users/default_avatar.jpg',
        bio: profile.aboutMe || "LeetCode User",
        smartBio,
        totalContributions: totalSolved,
        activeDays,
        longestStreak,
        consistencyScore,
        topLanguages: ["Algorithms", "Data Structures"],
        rank,
        achievements,
        history,
        followers: 0,
        platform: 'leetcode'
    };
}
