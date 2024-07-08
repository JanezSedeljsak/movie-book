import MovieCard from "@/components/moviecard";
import { getAllMovies } from "@/util/helpers";
import { MovieWithRating } from "@/util/interfaces";
import { Input, Select, Radio } from "antd";
import { useEffect, useState } from "react";
const { Search } = Input;

type SortAttribute = 'year' | 'title' | 'avgRating';

export default function Movies() {
    const [movies, setMovies] = useState(getAllMovies());
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState("ascending");
    const [orderValue, setOrderValue] = useState('title');

    const filterMovies = (search: string, movie: MovieWithRating) => {
        const isTitleMatch = movie.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());
        const isYearMatch = movie.year.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase());
        return isYearMatch || isTitleMatch;
    }

    useEffect(() => {
        const isAscending = order === 'ascending';
        const sortAttribute = orderValue as SortAttribute;

        const sortedMovies = movies.sort((a, b) => {
            if (isAscending) {
                return a[sortAttribute] > b[sortAttribute] ? 1 : -1;
            } else {
                return a[sortAttribute] < b[sortAttribute] ? 1 : -1;
            }
        });

        console.log(sortedMovies);
        setMovies([...sortedMovies]);

    }, [order, orderValue]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-start",
                alignContent: "center",
                flexWrap: "wrap",
                flexDirection: "column",
                flex: 1,
                width: '100%'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                <Search
                    style={{ width: 300 }}
                    placeholder="Search movies"
                    onSearch={(value, e, info) => setSearch(value)}
                    enterButton
                />
                <div>
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
                            { value: 'avgRating', label: 'By rating' },
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
                {movies
                    .filter(movie => filterMovies(search, movie))
                    .map((movie) => (
                        <MovieCard key={movie.title} {...movie} />
                    ))
                }
            </div>
        </div>
    );
}
