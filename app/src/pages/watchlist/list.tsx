import Image from "@/components/image";
import API from "@/services/api";
import { AuthState } from "@/store/auth";
import { useFetch } from "@/util/helpers";
import { MovieWithRating } from "@/util/interfaces";
import { List, Rate, Spin, Input } from "antd";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

const { Search } = Input;

function MovieList(props: { movies: MovieWithRating[] }) {
    return (
        <List
            itemLayout="horizontal"
            style={{ width: '100%' }}
            dataSource={props.movies}
            renderItem={(item: MovieWithRating) => (
                <List.Item style={{ width: '100%' }}>
                    <List.Item.Meta
                        avatar={<Image
                            src={item.imgSrc as string}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: '100%',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)'
                            }}
                        />}
                        title={item.title}
                        description={<div>
                            <p>Year <b>{item.year}</b></p>
                            <p style={{ marginBottom: 5 }}>Views <b>{item.numberOfRatings}</b></p>
                            <Rate allowHalf disabled defaultValue={item.avgRating} />
                        </div>}
                    />
                </List.Item>
            )}
        />
    );
}

export default function ListViewWatched() {
    const token = useSelector((state: { auth: AuthState }) => state.auth.token) as string;
    const [search, setSearch] = useState('');

    const fetchWatched = useCallback(() => {
        return API.getWatchedMovies(token, 16, search);
    }, [token, search]);

    const { data, isLoading, error } = useFetch<MovieWithRating[]>(fetchWatched);
    if (isLoading) {
        return <Spin />
    }

    if (error) {
        return null;
    }

    const movies = data as MovieWithRating[];
    return (
        <div style={{ width: '100%' }}>
            <Search
                style={{ width: 300, marginTop: 30, marginBottom: 15 }}
                placeholder="Search movies"
                onSearch={(value, e, info) => setSearch(value)}
                enterButton
            />
            <MovieList movies={movies} />
        </div>
    )
}