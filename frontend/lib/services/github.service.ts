import axios from 'axios';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

export const fetchGitHubData = async (username: string, token?: string) => {
  if (!token) {
    const error: any = new Error(
      "GitHub token is missing. Please ensure GITHUB_TOKEN environment variable is set in Vercel."
    );
    error.statusCode = 500;
    error.userFriendly = true;
    throw error;
  }

  const accessToken = token;

  const query = `
    query($username: String!) {
      user(login: $username) {
        name
        login
        avatarUrl
        bio
        createdAt
        followers {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            isPrivate
            pushedAt
          }
        }
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      GITHUB_GRAPHQL_URL,
      {
        query,
        variables: { username },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.errors) {
      const errorMessage = response.data.errors[0]?.message || '';

      if (errorMessage.includes('Could not resolve to a User')) {
        const error: any = new Error(`We couldn't find a GitHub user named "${username}". Please double-check the spelling and try again.`);
        error.statusCode = 404;
        error.userFriendly = true;
        throw error;
      }

      const error: any = new Error(`GitHub API Error: ${errorMessage}`);
      error.statusCode = 400;
      error.userFriendly = true;
      throw error;
    }

    const userData = response.data.data.user;

    if (!userData) {
      const error: any = new Error(`We couldn't find a GitHub user named "${username}". Please double-check the spelling and try again.`);
      error.statusCode = 404;
      error.userFriendly = true;
      throw error;
    }

    return userData;

  } catch (error: any) {
    if (error.response?.status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
      const resetTime = error.response?.headers['x-ratelimit-reset'];
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      const timeUntilReset = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / 60000) : 60;

      const friendlyError: any = new Error(
        `GitHub API rate limit reached. Please try again in ${timeUntilReset} minute${timeUntilReset > 1 ? 's' : ''}. ` +
        `Don't worry, your data is safe! ☕`
      );
      friendlyError.statusCode = 429;
      friendlyError.userFriendly = true;
      throw friendlyError;
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      const friendlyError: any = new Error(
        `GitHub is taking longer than expected to respond. Please check your internet connection and try again.`
      );
      friendlyError.statusCode = 503;
      friendlyError.userFriendly = true;
      throw friendlyError;
    }

    if (error.userFriendly) {
      throw error;
    }

    console.error('Error fetching GitHub data:', error.message);
    const friendlyError: any = new Error(
      `We're having trouble connecting to GitHub right now. Please try again in a moment.`
    );
    friendlyError.statusCode = 500;
    friendlyError.userFriendly = true;
    throw friendlyError;
  }
};
