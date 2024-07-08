import { useParams } from "react-router-dom"

export default function Movies () {
    const { movie_id } = useParams();
    
    return (
        <div>Film {movie_id}</div>
    )
}