import { useFetch } from '@/util/helpers';
import MovieCard from '@/components/moviecard';
import { MovieWithRating } from '@/util/interfaces';
import API from '@/services/api';
import { Spin } from 'antd';

function TopRatedMovies() {
    const { data, isLoading, error } = useFetch<MovieWithRating[]>(API.getTopRated);

    if (isLoading) {
        return <Spin />
    }

    if (error) {
        return null;
    }

    const movies = data as MovieWithRating[];
    return (
        <div style={{ display: 'flex', gap: '10px', marginTop: 10, marginBottom: 25, flexWrap: 'wrap' }}>
            {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
        </div>
    );
}

function MostWatchedMovies() {
    const { data, isLoading, error } = useFetch<MovieWithRating[]>(API.getMostWatched);

    if (isLoading) {
        return <Spin />
    }

    if (error) {
        return null;
    }

    const movies = data as MovieWithRating[];
    
    return (
        <div style={{ display: 'flex', gap: '10px', marginTop: 10, flexWrap: 'wrap' }}>
            {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
        </div>
    )
}

export default function Index() {
    return (
        <div style={{ marginTop: 30, display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
            <h2 style={{ color: '#2c3e50' }}>Top Rated Movies</h2>
            <TopRatedMovies />
            <h2 style={{ color: '#2c3e50' }}>Most watched</h2>
            <MostWatchedMovies />
        </div>
    );
}