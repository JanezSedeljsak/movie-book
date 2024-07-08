import MovieCard from "@/components/moviecard";
import { getAllMovies } from "@/util/helpers";
import { MovieWithRating } from "@/util/interfaces";
import { Input } from "antd";
import { useState } from "react";
const { Search } = Input;

export default function Movies() {
  const movies = getAllMovies();
  const [search, setSearch] = useState("");

  const filterMovies = (search: string, movie: MovieWithRating) => {
    const isTitleMatch = movie.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());
    const isYearMatch = movie.year.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase());
    return isYearMatch || isTitleMatch;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignContent: "center",
        flexWrap: "wrap",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Search
        style={{ width: 300, marginTop: 30 }}
        placeholder="Search movies"
        onSearch={(value, e, info) => setSearch(value)}
        enterButton
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
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
