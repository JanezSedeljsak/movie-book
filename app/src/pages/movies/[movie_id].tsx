import { getMovies, useFetch } from "@/util/helpers";
import { MovieWithStats } from "@/util/interfaces";
import { useParams } from "react-router-dom";
import { Rate, Spin, Divider } from "antd";
import API from "@/services/api";
import MovieCard from "@/components/moviecard";
import { PlayCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

function UserRate(movie: MovieWithStats) {
    const [rating, setRating] = useState(5.0);

    if (movie.userRating) {
        <Rate allowHalf disabled value={movie.userRating} />
    }

    return (
        <Rate 
            allowHalf 
            onChange={() => {
                setRating(rating);
                enqueueSnackbar(`You have rated this movie with ${rating.toFixed(1)}`, {
                    variant: 'info'
                });
            }} 
            value={rating} 
        />
    );
}

function SelectedMovie(props: { id: string }) {
    // TODO: fix rerendering
    const { data, isLoading, error } = useFetch<MovieWithStats>(() => API.getMovie(props.id));

    if (isLoading) {
        return <Spin />
    }

    if (error) {
        return null;
    }

    const selectedMovie = data as MovieWithStats;
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: 20,
                    borderRadius: '10px',
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    overflow: 'hidden'
                }}
            >
                <div>
                    <img src={selectedMovie.imgSrc} />
                </div>
                <div style={{ minWidth: 500, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, padding: 10 }}>
                    <div>
                        <h1 style={{ color: '#2c3e50' }}><PlayCircleFilled /> {selectedMovie.title}</h1>
                        <span>Year of release: <b>{selectedMovie.year}</b></span><br />
                        <span>Avg rating: <b>{selectedMovie.avgRating.toFixed(1)}</b></span><br />
                        <span>Number of ratings: <b>{selectedMovie.numberOfRatings}</b></span><br />
                        <span>Max rating: <b>{selectedMovie.maxRating}</b></span><br />
                        <span>Min rating: <b>{selectedMovie.minRating}</b></span><br />
                    </div>

                    <div>
                        <Divider />
                        <h3 style={{ marginBottom: 5 }}>Rate this movie:</h3>
                        <UserRate {...selectedMovie} />
                    </div>
                </div>
            </div>
            <h2 style={{ color: '#2c3e50', marginTop: 30 }}>
                Similar movies to
                <span style={{ color: '#333' }}> {selectedMovie.title}</span>
            </h2>
        </>
    )
}

function SimilarMovies(props: { id: string }) {
    const movies = getMovies();

    return (
        <div style={{ display: 'flex', gap: 10 }}>
            {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
        </div>
    )
}

export default function Movie() {
    const { movie_id } = useParams();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "10px",
                flexDirection: 'column'
            }}
        >
            <SelectedMovie id={movie_id as string} />
            <SimilarMovies id={movie_id as string} />
        </div>
    );
}
