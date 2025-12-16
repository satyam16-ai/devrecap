import { Request, Response } from 'express';
import { fetchGitHubData } from '../services/github.service';

export const getStats = async (req: Request, res: Response) => {
    const targetUsername = req.query.username as string;

    const token = req.headers.authorization?.split(' ')[1];

    if (!targetUsername && !token) {
        res.status(400).json({ error: 'Username is required' });
        return;
    }

    try {
        if (!targetUsername) {
            res.status(400).json({ error: 'Username parameter is required now.' });
            return;
        }

        const data = await fetchGitHubData(targetUsername, token);

        if (!data) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Process Data
        const calendar = data.contributionsCollection.contributionCalendar;
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

        // Fetch LeetCode Data Removed

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

        // --- NEW: Gamification Logic ---
        // (Calculated AFTER languages now)
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
        if (weekend_contributions > 50) achievements.push("Weekend Warrior");

        // Repo Count
        if (data.repositories.nodes.length > 50) achievements.push("Repo Titan");

        // Smart Fallback
        if (achievements.length === 0) achievements.push("Hello World");

        // Cap at 6 distinct interesting ones (prioritize rarer ones ideally, but slice is fine for now)
        const uniqueAchievements = [...new Set(achievements)].slice(0, 6);
        // -------------------------------

        // --- NEW: Smart Bio Generation ---
        const primaryLang = topLanguages[0] || "Code";
        let generatedBio = `A ${primaryLang} enthusiast`;

        if (consistencyScore > 50) {
            generatedBio += " with unstoppable momentum.";
        } else {
            generatedBio += " building cool things.";
        }

        if (rank === "Diamond") generatedBio = `A dedicated ${primaryLang} master operating at peak performance.`;
        // ---------------------------------

        // --- NEW: Mini Heatmap Data ---
        // Get last 15 weeks for a nice visual block
        const history = weeks.slice(-15).map((week: any) =>
            week.contributionDays.map((day: any) => ({
                count: day.contributionCount,
                level: day.contributionCount === 0 ? 0 :
                    day.contributionCount < 3 ? 1 :
                        day.contributionCount < 6 ? 2 : 3
            }))
        );
        // ------------------------------

        // Construct Response
        const stats = {
            username: data.login,
            name: data.name,
            avatarUrl: data.avatarUrl,
            bio: data.bio, // Original GitHub bio
            smartBio: generatedBio, // Our AI-style summary
            totalContributions: calendar.totalContributions,
            activeDays,
            longestStreak,
            consistencyScore,
            topLanguages,
            topRepo: data.repositories.nodes[0]?.name || 'N/A',
            rank,
            achievements: uniqueAchievements,
            history, // For the heatmap
        };

        res.json(stats);
    } catch (error: any) {
        console.error('Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
};
