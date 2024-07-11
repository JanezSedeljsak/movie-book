import MovieCard from "@/components/moviecard";
import API from "@/services/api";
import { useFetch } from "@/util/helpers";
import { MovieWithRating } from "@/util/interfaces";
import { Input, Select, Radio, Spin } from "antd";
import { useState, useCallback } from "react";
const { Search } = Input;

interface MovieListProps {
    title: string,
    order: string,
    orderField: string
}

function MovieList(props: MovieListProps) {
    const fetchMovies = useCallback(() => {
        return API.getMovies(props.title, props.order, props.orderField);
    }, [props.title, props.order, props.orderField]);

    const { data, isLoading, error } = useFetch<MovieWithRating[]>(fetchMovies);

    if (isLoading) {
        return <Spin />
    }

    if (error) {
        return null;
    }

    const movies = data as MovieWithRating[];
    return (
        <>
            {movies.map((movie) => <MovieCard key={movie.id} {...movie} />)}
        </>
    )
}

export default function Movies() {
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState("ascending");
    const [orderValue, setOrderValue] = useState('title');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 30 }}>
                <Search
                    style={{ width: 300 }}
                    placeholder="Search movies"
                    onSearch={(value, e, info) => setSearch(value)}
                    enterButton
                />
                <div style={{ marginLeft: 20 }}>
                    <Radio.Group value={order} onChange={e => setOrder(e.target.value)}>
                        <Radio.Button value="ascending">Ascending</Radio.Button>
                        <Radio.Button value="descending">Descending</Radio.Button>
                    </Radio.Group>
                    <Select
                        showSearch
                        defaultValue={'title'}
                        onChange={e => setOrderValue(e)}
                        placeholder="Sort movies"
                        options={[
                            { value: 'title', label: 'By title' },
                            { value: 'year', label: 'By year' },
                            { value: 'rating', label: 'By rating' },
                        ]}
                    />
                </div>

            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    marginTop: 10,
                    gap: "10px",
                }}
            >
                <MovieList title={search} order={order} orderField={orderValue} />
            </div>
        </div>
    );
}
