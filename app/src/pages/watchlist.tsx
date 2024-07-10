import { getMovies } from '@/util/helpers';
import MovieCard from '@/components/moviecard';
import { useAuth } from '@/services/auth';

export default function WatchList() {
    useAuth();

    const recommendedMovies = getMovies();
    const watchedMovies = getMovies();

    return (
        <div style={{ marginTop: 30, display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
            <h2 style={{ color: '#2c3e50' }}>Recommendations</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: 10, marginBottom: 25, flexWrap: 'wrap' }}>
                {recommendedMovies.map(movie => <MovieCard key={movie.id} {...movie} />)}
            </div>

            <h2 style={{ color: '#2c3e50' }}>Watched</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: 10, flexWrap: 'wrap' }}>
                {watchedMovies.map(movie => <MovieCard key={movie.id} {...movie} />)}
            </div>
        </div>
    );
}