import { Card } from 'antd';
import { MovieWithRating } from '@/util/interfaces';
import { getMovies } from '@/util/helpers';

const { Meta } = Card;

const MovieCard = (data: MovieWithRating) => {
    return (
        <Card
            hoverable
            style={{ width: 160 }}
            cover={<img alt="example" src={data.imgSrc} />}
        >
            <Meta title={data.title} description={data.year} />
        </Card>
    )
}

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