import { getAllMovies } from "@/util/helpers";
import { MovieWithRating } from "@/util/interfaces";
import { useParams } from "react-router-dom";
import { Rate } from "antd";

export default function Movie() {
    const { movie_id } = useParams();

    const movies = getAllMovies();
    const selectedMovie = movies.find(
        (movie) => movie.id === movie_id
    ) as MovieWithRating;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "10px",
            }}
        >
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
                <div style={{ minWidth: 300, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, padding: 10 }}>
                    <div>
                        <h1>{selectedMovie.title}</h1>
                        <span>Year of release: <b>{selectedMovie.year}</b></span><br />
                        <span>Avg rating: <b>{selectedMovie.avgRating.toFixed(1)}</b></span><br />
                        <span>Number of ratings: <b>{selectedMovie.numberOfRatings}</b></span><br />
                    </div>

                    <div>
                        <h3>Rate this movie:</h3>
                        <Rate allowHalf defaultValue={5.0} />
                    </div>
                </div>
            </div>
        </div>
    );
}
