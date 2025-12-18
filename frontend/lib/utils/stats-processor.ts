export function processGitHubStats(data: any) {
    const calendar = data.contributionsCollection.contributionCalendar;
    const username = data.login;

    if (calendar.totalContributions === 0) {
        // Return null or handle as error separately, but logic here assumes valid processing
        // Can throw error or return a specific "empty" object
        return null;
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
    if (data.repositories && data.repositories.nodes) {
        data.repositories.nodes.forEach((repo: any) => {
            if (repo.primaryLanguage) {
                const lang = repo.primaryLanguage.name;
                languageMap[lang] = (languageMap[lang] || 0) + 1;
            }
        });
    }

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

    if (data.repositories?.nodes?.length > 50) achievements.push("Repo Titan");

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
        rank,
        topLanguages,
        achievements: uniqueAchievements,
        history, // This structure matches what frontend expects for heatmaps
        followers: data.followers?.totalCount || 0
    };
}
