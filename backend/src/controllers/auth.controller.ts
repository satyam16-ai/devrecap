import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export const login = (req: Request, res: Response) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.GITHUB_REDIRECT_URI!,
        scope: 'read:user user:email repo', // Scopes needed for stats
    });
    res.redirect(`${GITHUB_AUTH_URL}?${params.toString()}`);
};

export const callback = async (req: Request, res: Response) => {
    const code = req.query.code as string;

    if (!code) {
        res.status(400).send('Code not provided');
        return; // Ensure we return to stop execution
    }

    try {
        const response = await axios.post(
            GITHUB_TOKEN_URL,
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        const { access_token } = response.data;

        if (access_token) {
            // Fetch User Profile to get Username
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            const username = userResponse.data.login;

            // Redirect with both token and username
            res.redirect(`http://localhost:3000/dashboard?username=${username}&token=${access_token}`);
        } else {
            res.status(400).json({ error: 'Failed to obtain access token', details: response.data });
        }
    } catch (error) {
        console.error('GitHub OAuth Error:', error);
        res.status(500).send('Authentication failed');
    }
};
