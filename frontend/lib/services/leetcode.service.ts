import axios from 'axios';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

export const fetchLeetCodeData = async (username: string) => {
    const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          aboutMe
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
      }
    }
  `;

    try {
        const response = await axios.post(
            LEETCODE_GRAPHQL_URL,
            {
                query,
                variables: { username },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.errors) {
            return null;
        }

        return response.data.data.matchedUser;
    } catch (error) {
        console.error('Error fetching LeetCode data:', error);
        return null;
    }
};
