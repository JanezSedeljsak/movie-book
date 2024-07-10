import { createDirectus, authentication, rest } from '@directus/sdk';
import { config } from '@/config';

const directus = createDirectus(config.DIRECTUS_URI)
    .with(authentication('json'))
    .with(rest());

export default class DirectusService {
    static async login(email: string, password: string) {
        const loginResult = await directus.login(email, password);
        return loginResult;
    }
}