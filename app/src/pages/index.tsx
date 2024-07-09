import { getMovies } from '@/util/helpers';
import MovieCard from '@/components/moviecard';

export default function Index() {

    const topRatedMovies = getMovies();
    const mostWatchedMovies = getMovies();

    return (
        <div style={{ marginTop: 30, display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
            <h2 style={{ color: '#2c3e50' }}>Top Rated Movies</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: 10, marginBottom: 25, flexWrap: 'wrap' }}>
                {topRatedMovies.map(movie => <MovieCard key={movie.id} {...movie} />)}
            </div>

            <h2 style={{ color: '#2c3e50' }}>Most watched</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: 10, flexWrap: 'wrap' }}>
                {mostWatchedMovies.map(movie => <MovieCard key={movie.id} {...movie} />)}
            </div>
        </div>
    );
}