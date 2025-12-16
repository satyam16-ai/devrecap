import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

export const fetchGitHubData = async (username: string, token?: string) => {
  // Use provided token or fallback to server env token
  const accessToken = token || process.env.GITHUB_TOKEN;

  if (!accessToken || accessToken === 'your_personal_access_token') {
    throw new Error("CRITICAL ERROR: GITHUB_TOKEN is missing or invalid in backend/.env. Please generate a Personal Access Token with 'public_repo' scope and paste it in the .env file.");
  }

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
      // Handle "Could not resolve to a User" specific error for better UX
      throw new Error(JSON.stringify(response.data.errors));
    }

    return response.data.data.user;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
};
