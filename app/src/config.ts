export interface Config {
    DIRECTUS_URI: string,
    API_URI: string
}

export const config: Config = {
    DIRECTUS_URI: import.meta.env.DIRECTUS_URI ?? 'http://localhost:8055/',
    API_URI: import.meta.env.API_URI ?? 'http://localhost:5000/'
}
