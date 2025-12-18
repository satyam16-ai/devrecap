import { Request, Response } from 'express';
import { fetchGitHubData } from '../services/github.service';
import { fetchLeetCodeData } from '../services/leetcode.service';

export const getStats = async (req: Request, res: Response) => {
    const targetUsername = req.query.username as string;
    const platform = (req.query.platform as string) || 'github';

    const token = req.headers.authorization?.split(' ')[1];

    if (!targetUsername) {
        res.status(400).json({ error: 'Username parameter is required.' });
        return;
    }

    try {
        if (platform === 'leetcode') {
            await handleLeetCode(targetUsername, res);
        } else {
            await handleGithub(targetUsername, token, res);
        }
    } catch (error: any) {
        console.error('Stats Error:', error.message || error);

        // Handle user-friendly errors with proper status codes
        if (error.userFriendly) {
            res.status(error.statusCode || 500).json({
                error: error.message
            });
            return;
        }

        // Generic fallback for unexpected errors
        res.status(500).json({
            error: 'Something went wrong while fetching your stats. Please try again later.'
        });
    }
};

const handleLeetCode = async (username: string, res: Response) => {
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
    const calendar = JSON.parse(submissionCalendar || '{}'); // Unix timestamp -> count

    let totalSubmissions = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;

    // Convert calendar object to array of entries sorted by date
    const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);

    // Calculate Stats
    // Flatten into a daily map for easier heatmap generation and streak calc
    const dayMap = new Map<string, number>(); // 'YYYY-MM-DD' -> count

    timestamps.forEach(ts => {
        const date = new Date(ts * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const count = calendar[ts];
        dayMap.set(dateStr, count);
        totalSubmissions += count;
        activeDays++;
    });

    // Streak Calculation (Naive implementation iterating through days)
    // For robust streak, we can iterate backwards from today, etc. 
    // Simplified: iterate through sorted timestamps

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
    // Start from Sunday 15 weeks ago
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

    const stats = {
        username: data.username,
        name: profile.realName || data.username,
        avatarUrl: profile.userAvatar || 'https://assets.leetcode.com/users/default_avatar.jpg',
        bio: profile.aboutMe || "LeetCode User",
        smartBio,
        totalContributions: totalSolved, // Display Solved Count instead of 'contributions'
        activeDays,
        longestStreak,
        consistencyScore,
        topLanguages: ["Algorithms", "Data Structures"], // Placeholder
        topRepo: `Hard: ${hardSolved}`,
        rank: getRankFromSolved(totalSolved), // Helper function
        achievements,
        history,
        platform: 'leetcode'
    };

    res.json(stats);
};

const handleGithub = async (targetUsername: string, token: string | undefined, res: Response) => {
    const data = await fetchGitHubData(targetUsername, token);

    if (!data) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Process Data
    const calendar = data.contributionsCollection.contributionCalendar;

    // Check for empty activity
    if (calendar.totalContributions === 0) {
        const error: any = new Error(
            `No GitHub activity found for ${targetUsername} this year. ` +
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

    // Flatten days
    const allDays = weeks.flatMap((w: any) => w.contributionDays);
    totalDays = allDays.length;

    // Calculate streaks and active days
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

    // Top Languages
    const languageMap: Record<string, number> = {};
    data.repositories.nodes.forEach((repo: any) => {
        if (repo.primaryLanguage) {
            const lang = repo.primaryLanguage.name;
            languageMap[lang] = (languageMap[lang] || 0) + 1;
        }
    });

    const topLanguages = Object.entries(languageMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name);

    // Gamification
    let rank = "Bronze";
    if (consistencyScore > 85) rank = "Diamond";
    else if (consistencyScore > 70) rank = "Platinum";
    else if (consistencyScore > 50) rank = "Gold";
    else if (consistencyScore > 25) rank = "Silver";

    const achievements: string[] = [];

    // Streak Badges
    if (longestStreak > 100) achievements.push("Centurion");
    else if (longestStreak > 50) achievements.push("Unstoppable");
    else if (longestStreak > 20) achievements.push("Marathon Runner");

    // Contribution Badges
    if (calendar.totalContributions > 2000) achievements.push("Git Legend");
    else if (calendar.totalContributions > 1000) achievements.push("1k Club");
    else if (calendar.totalContributions > 500) achievements.push("Rising Star");

    // Activity Badges
    if (activeDays > 300) achievements.push("Daily Grinder");
    if (consistencyScore > 95) achievements.push("Consistency God");

    // Language Badges
    if (topLanguages.includes("TypeScript") || topLanguages.includes("JavaScript")) achievements.push("JS Ninja");
    if (topLanguages.includes("Python")) achievements.push("Snake Charmer");
    if (topLanguages.includes("Rust")) achievements.push("Rustacean");
    if (topLanguages.includes("Go")) achievements.push("Gopher");
    if (topLanguages.length >= 4) achievements.push("Polyglot");

    // Fun Badges
    const weekend_contributions = allDays.filter((d: any) => new Date(d.date).getDay() % 6 === 0 && d.contributionCount > 0).length;
    if (weekend_contributions > 5) achievements.push("Weekend Warrior"); // Tweaked lower for easier demo

    // Repo Count
    if (data.repositories.nodes.length > 50) achievements.push("Repo Titan");

    // Smart Fallback
    if (achievements.length === 0) achievements.push("Hello World");

    const uniqueAchievements = [...new Set(achievements)].slice(0, 6);

    // Smart Bio Generation
    const primaryLang = topLanguages[0] || "Code";
    let generatedBio = `A ${primaryLang} enthusiast`;

    if (consistencyScore > 50) {
        generatedBio += " with unstoppable momentum.";
    } else {
        generatedBio += " building cool things.";
    }

    if (rank === "Diamond") generatedBio = `A dedicated ${primaryLang} master operating at peak performance.`;

    // Last 15 weeks for heatmap
    const history = weeks.slice(-15).map((week: any) =>
        week.contributionDays.map((day: any) => ({
            count: day.contributionCount,
            level: day.contributionCount === 0 ? 0 :
                day.contributionCount < 3 ? 1 :
                    day.contributionCount < 6 ? 2 : 3
        }))
    );

    const stats = {
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

    res.json(stats);
};

function getRankFromSolved(totalSolved: number) {
    if (totalSolved > 1000) return "Guardian";
    if (totalSolved > 500) return "Diamond";
    if (totalSolved > 200) return "Platinum";
    if (totalSolved > 50) return "Gold";
    return "Bronze";
}
