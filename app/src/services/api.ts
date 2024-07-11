import { fetchData } from "@/util/helpers";
import { MovieWithRating, MovieWithStats } from "@/util/interfaces";

export default class API {

    static getTopRated(): Promise<MovieWithRating[]> {
        return fetchData('movies/top/rated');
    }

    static getMostWatched(): Promise<MovieWithRating[]> {
        return fetchData('movies/top/watched');
    }

    static getMovie(movieId: string, jwt: string): Promise<MovieWithStats> {
        return fetchData(`movies/${movieId}`, jwt);
    }

    static getWatchedMovies(jwt: string, limit: number = 8): Promise<MovieWithRating[]> {
        return fetchData(`movies/watched?limit=${limit}`, jwt);
    }

    static getMovies(title: string, order: string, orderField: string): Promise<MovieWithRating[]> {
        return fetchData(`movies?title=${title}&order=${order}&order_field=${orderField}`);
    }
}