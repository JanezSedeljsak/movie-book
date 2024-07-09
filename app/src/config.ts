export interface Config {
    DIRECTUS_URI: string,
    RECOMMENDER_URI: string
}

export const config: Config = {
    DIRECTUS_URI: import.meta.env.DIRECTUS_URI ?? 'http://localhost:8055/',
    RECOMMENDER_URI: import.meta.env.RECOMMENDER_URI ?? 'http://localhost:8001/'
}
