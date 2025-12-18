import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

export const fetchLeetCodeData = async (username: string) => {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        submissionCalendar
        profile {
          ranking
          reputation
          realName
          userAvatar
          aboutMe
          countryName
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      LEETCODE_API_URL,
      {
        query,
        variables: { username },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
      }
    );

    if (response.data.errors) {
      console.warn(`LeetCode user ${username} not found or error.`);
      return null;
    }

    return response.data.data.matchedUser;
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return null;
  }
};
