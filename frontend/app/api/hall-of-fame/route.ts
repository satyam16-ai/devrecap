import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/services/github.service';
import { processGitHubStats } from '@/lib/utils/stats-processor';

// Legend configuration
const LEGENDS = [
    { username: "torvalds", theme: "matrix" },
    { username: "gaearon", theme: "react_dark" },
    { username: "shadcn", theme: "midnight_blur" },
    { username: "leerob", theme: "vercel" }
];

export const runtime = 'edge'; // Use Edge Runtime for better performance

export async function GET() {
    try {
        const promises = LEGENDS.map(async (legend) => {
            try {
                // Pass process.env.GITHUB_TOKEN explicitly
                const rawData = await fetchGitHubData(legend.username, process.env.GITHUB_TOKEN);
                const processedData = processGitHubStats(rawData);

                if (!processedData) return null;

                return {
                    ...processedData,
                    theme: legend.theme,
                    username: legend.username
                };
            } catch (error) {
                console.error(`Failed to fetch legend ${legend.username}:`, error);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(r => r !== null);

        // Cache for 24 hours (86400 seconds)
        return NextResponse.json(validResults, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
                'CDN-Cache-Control': 'public, s-maxage=86400',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=86400',
            }
        });

    } catch (error) {
        console.error('Hall of Fame API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch Hall of Fame' }, { status: 500 });
    }
}
