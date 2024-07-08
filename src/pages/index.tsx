import { getMovies } from '@/util/helpers';
import MovieCard from '@/components/moviecard';

export default function Index() {

    const topRatedMovies = getMovies();
    const mostWatchedMovies = getMovies();

    return (
        <div style={{ marginTop: 30, display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
            <h3>Top Rated Movies</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                {topRatedMovies.map(movie => <MovieCard {...movie} />)}
            </div>

            <h3>Most watched</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                {mostWatchedMovies.map(movie => <MovieCard {...movie} />)}
            </div>
        </div>
    );
}