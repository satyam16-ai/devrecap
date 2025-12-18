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

        // Handle user-friendly errors
        if (error.userFriendly) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode || 500 }
            );
        }

        // Generic fallback
        return NextResponse.json(
            { error: 'Something went wrong while fetching your stats. Please try again later.' },
            { status: 500 }
        );
    }
}

async function handleGitHub(username: string, token?: string) {
    // Get token from environment if not provided
    const githubToken = token || process.env.GITHUB_TOKEN;

    console.log('Environment check:', {
        hasToken: !!token,
        hasEnvToken: !!process.env.GITHUB_TOKEN,
        envKeys: Object.keys(process.env).filter(k => k.includes('GITHUB')),
        tokenLength: githubToken?.length || 0
    });

    const data = await fetchGitHubData(username, githubToken);

    if (!data) {
        const error: any = new Error(`We couldn't find a GitHub user named "${username}". Please double-check the spelling and try again.`);
        error.statusCode = 404;
        error.userFriendly = true;
        throw error;
    }

    const calendar = data.contributionsCollection.contributionCalendar;

    if (calendar.totalContributions === 0) {
        const error: any = new Error(
            `No GitHub activity found for ${username} this year. ` +
            `Try making some commits or contributions, then come back to create your recap! 🚀`
        );
        error.statusCode = 404;
        error.userFriendly = true;
        throw error;
    }

    const weeks = calendar.weeks;
    let activeDays = 0;
    let totalDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    const allDays = weeks.flatMap((w: any) => w.contributionDays);
    totalDays = allDays.length;

    allDays.forEach((day: any) => {
        if (day.contributionCount > 0) {
            activeDays++;
            currentStreak++;
            if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else {
            currentStreak = 0;
        }
    });

    const consistencyScore = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

    const languageMap: Record<string, number> = {};
    data.repositories.nodes.forEach((repo: any) => {
        if (repo.primaryLanguage) {
            const lang = repo.primaryLanguage.name;
            languageMap[lang] = (languageMap[lang] || 0) + 1;
        }
    });

    const topLanguages = Object.entries(languageMap)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([name]) => name);

    let rank = "Bronze";
    if (consistencyScore > 85) rank = "Diamond";
    else if (consistencyScore > 70) rank = "Platinum";
    else if (consistencyScore > 50) rank = "Gold";
    else if (consistencyScore > 25) rank = "Silver";

    const achievements: string[] = [];
    if (longestStreak > 100) achievements.push("Centurion");
    else if (longestStreak > 50) achievements.push("Unstoppable");
    else if (longestStreak > 20) achievements.push("Marathon Runner");

    if (calendar.totalContributions > 2000) achievements.push("Git Legend");
    else if (calendar.totalContributions > 1000) achievements.push("1k Club");
    else if (calendar.totalContributions > 500) achievements.push("Rising Star");

    if (activeDays > 300) achievements.push("Daily Grinder");
    if (consistencyScore > 95) achievements.push("Consistency God");

    if (topLanguages.includes("TypeScript") || topLanguages.includes("JavaScript")) achievements.push("JS Ninja");
    if (topLanguages.includes("Python")) achievements.push("Snake Charmer");
    if (topLanguages.includes("Rust")) achievements.push("Rustacean");
    if (topLanguages.includes("Go")) achievements.push("Gopher");
    if (topLanguages.length >= 4) achievements.push("Polyglot");

    const weekend_contributions = allDays.filter((d: any) => new Date(d.date).getDay() % 6 === 0 && d.contributionCount > 0).length;
    if (weekend_contributions > 5) achievements.push("Weekend Warrior");

    if (data.repositories.nodes.length > 50) achievements.push("Repo Titan");

    if (achievements.length === 0) achievements.push("Hello World");

    const uniqueAchievements = [...new Set(achievements)].slice(0, 6);

    const primaryLang = topLanguages[0] || "Code";
    let generatedBio = `A ${primaryLang} enthusiast`;

    if (consistencyScore > 50) {
        generatedBio += " with unstoppable momentum.";
    } else {
        generatedBio += " building cool things.";
    }

    if (rank === "Diamond") generatedBio = `A dedicated ${primaryLang} master operating at peak performance.`;

    const history = weeks.slice(-15).map((week: any) =>
        week.contributionDays.map((day: any) => ({
            count: day.contributionCount,
            level: day.contributionCount === 0 ? 0 :
                day.contributionCount < 3 ? 1 :
                    day.contributionCount < 6 ? 2 : 3
        }))
    );

    return {
        username: data.login,
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        smartBio: generatedBio,
        totalContributions: calendar.totalContributions,
        activeDays,
        longestStreak,
        consistencyScore,
        topLanguages,
        topRepo: data.repositories.nodes[0]?.name || 'N/A',
        rank,
        achievements: uniqueAchievements,
        history,
        platform: 'github'
    };
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

    // LeetCode processing logic here (keeping it simple for now)
    const { submitStats, submissionCalendar, profile } = data;
    const calendar = JSON.parse(submissionCalendar || '{}');

    let totalSubmissions = 0;
    let activeDays = 0;
    const dayMap = new Map<string, number>();

    const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);

    timestamps.forEach(ts => {
        const date = new Date(ts * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const count = calendar[ts];
        dayMap.set(dateStr, count);
        totalSubmissions += count;
        activeDays++;
    });

    const totalSolved = submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'All')?.count || 0;

    return {
        username: data.username,
        name: profile.realName || data.username,
        avatarUrl: profile.userAvatar || 'https://assets.leetcode.com/users/default_avatar.jpg',
        bio: profile.aboutMe || "LeetCode User",
        totalContributions: totalSolved,
        rank: totalSolved > 500 ? "Diamond" : totalSolved > 200 ? "Platinum" : "Gold",
        platform: 'leetcode'
    };
}
