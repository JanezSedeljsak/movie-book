import { fetchData } from "@/util/helpers";
import { MovieWithRating, MovieWithStats } from "@/util/interfaces";

export default class API {

    static getTopRated(): Promise<MovieWithRating[]> {
        return fetchData('/movies/top/rated');
    }

    static getMostWatched(): Promise<MovieWithRating[]> {
        return fetchData('/movies/top/watched');
    }

    static getMovie(movieId: string): Promise<MovieWithStats> {
        return fetchData(`/movies/${movieId}`);
    }
}