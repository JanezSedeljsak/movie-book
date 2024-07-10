import { createDirectus, authentication, rest } from '@directus/sdk';
import { config } from '@/config';

const directus = createDirectus(config.DIRECTUS_URI)
    .with(authentication('json'))
    .with(rest());

export default class DirectusService {

    static async login(email: string, password: string) {
        const loginResult = await directus.login(email, password);
        if (loginResult.access_token) {
            const profile = await DirectusService.getProfile(loginResult.access_token as string);
            return { ...loginResult, ...profile?.data };
        }

        return loginResult;
    }

    static async getProfile(jwt: string) {
        const userResponse = await fetch(`${config.DIRECTUS_URI}users/me`, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user information');
        }

        const userData = await userResponse.json();
        return userData;
    }

    static async createRating(movieId: string, userId: string, rating: number, jwt: string) {
        const response = await fetch(`${config.DIRECTUS_URI}items/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                id: crypto.randomUUID(), // browser builtin
                movie_id: movieId,
                rating: parseFloat(rating.toFixed(1)),
                user_id: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create rating');
        }

        return await response.json();
    }
}