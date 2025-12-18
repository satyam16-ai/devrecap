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
    // ... (token logic)
    const githubToken = (token || process.env.GITHUB_TOKEN || '').trim();

    // ... (logging)

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
