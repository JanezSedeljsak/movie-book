import MovieCard from "@/components/moviecard";
import { getMovies } from "@/util/helpers";
import { Input } from 'antd';
import { useState } from "react";
const { Search } = Input;

export default function Movies () {
    const movies = getMovies();
    const [search, setSearch] = useState('');

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Search placeholder="input search text" onSearch={(value, e, info) => setSearch(value)} enterButton />
            <p>Vsebina {search}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', marginTop: 300, gap: '10px' }}>
                {movies.map(movie => <MovieCard {...movie} />)}
            </div>
        </div>
        
    )
}