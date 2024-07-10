import { getMovies, useFetch } from '@/util/helpers';
import MovieCard from '@/components/moviecard';
import { useAuth } from '@/services/auth';
import { MovieWithRating } from '@/util/interfaces';
import { Spin } from 'antd';
import API from '@/services/api';
import { useSelector } from 'react-redux';
import { AuthState } from '@/store/auth';
import { useCallback } from 'react';

function WatchedMovies() {
    const token = useSelector((state: { auth: AuthState }) => state.auth.token) as string;
    const fetchWatched = useCallback(() => {
        return API.getWatchedMovies(token);
    }, [token]);

    const { data, isLoading, error } = useFetch<MovieWithRating[]>(fetchWatched);

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

export default function WatchList() {
    useAuth();

    const recommendedMovies = getMovies();

    return (
        <div style={{ marginTop: 30, display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
            <h2 style={{ color: '#2c3e50' }}>Recommendations</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: 10, marginBottom: 25, flexWrap: 'wrap' }}>
                {recommendedMovies.map(movie => <MovieCard key={movie.id} {...movie} />)}
            </div>

            <h2 style={{ color: '#2c3e50' }}>Watched</h2>
            <WatchedMovies />
        </div>
    );
}