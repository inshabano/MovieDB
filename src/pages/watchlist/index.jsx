import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext } from "react";

import { Moviegenres } from "./genreList";
import { ALL_GENRES } from "./genreList";
import { useDebounce } from "../../hooks/Debounce";
import MovieContext from "../../context/movieContext";

const Watchlist = ({ 
  // movies, 
  // removeFromWatchlist, 
  // setWatchlist
 }) => {
  const [uniqueGenres, setUniqueGenres] = useState([ALL_GENRES]);
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRES);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const {watchlist:movies, removeFromWatchlist, setWatchlist} = useContext(MovieContext)

  const sortAscending = () => {
    const sortedMovies = [...movies].sort((a, b) => {
      return a.vote_average - b.vote_average;
    });
    setWatchlist(sortedMovies);
  };
  const sortDecending = () => {
    const sortedMovies = [...movies].sort((a, b) => {
      return  b.vote_average-a.vote_average;
    });
    setWatchlist(sortedMovies);
  };

  useEffect(() => {
    const genreSet = new Set();
    movies.forEach((movie) => {
      movie.genre_ids.forEach((genreId) => {
        const genre = Moviegenres.find((gen) => gen.id === genreId);
        if (genre) {
          genreSet.add(genre.name);
        }
      });
    });
    setUniqueGenres([ALL_GENRES, ...genreSet]);
  }, [movies]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-8 mt-6 mb-10 cursor-pointer">
        {uniqueGenres.map((genre, index) => (
          <div
            key={index}
            onClick={() => setSelectedGenre(genre)}
            className={`bg-slate-400 w-[8rem] p-4 rounded-lg
             text-center font-bold enabled:hover:bg-slate-300
              transition duration-300 transform hover:scale-110
         ${genre === selectedGenre ? "bg-blue-400" : "bg-slate-400"}`}
          >
            {genre}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center m-8">
        <input
          value={search}
          className="bg-slate-200 p-3 enabled:hover:bg-slate-300 transition duration-300 transform hover:scale-110 disabled:opacity-75 w-[20rem] text-black outline-none"
          type="text"
          placeholder="Search Movie"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="flex items-center justify-center">
        <table className="rounded-xl border-1 w-[90%] overflow-hidden">
          <thead className="bg-slate-900 h-12 w-full rounded-lg">
            <tr className="text-left border-b-[1px]">
              <th className="pl-12">Name</th>
              <th className="flex gap-1 items-center pt-3">
                <FontAwesomeIcon
                  onClick={() => sortDecending('vote_average')}
                  icon={faArrowUp}
                  className="cursor-pointer"
                />
                <span>Ratings</span>
                <FontAwesomeIcon
                  onClick={() =>  sortAscending('vote_average')}
                  icon={faArrowDown}
                  className="cursor-pointer"
                />
              </th>
              <th>Release Date</th>
              <th>Genre</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(movies) &&
              movies
                .filter((movie) => {
                  if (selectedGenre === ALL_GENRES) return true;

                  const movieGenres = movie.genre_ids.map((id) => {
                    const genre = Moviegenres.find((gen) => gen.id === id);
                    return genre ? genre.name : null;
                  });
                  return movieGenres.includes(selectedGenre);
                })
                .filter((movieObj) => {
                  return movieObj.title
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase());
                })
                .map((movie) => {
                  const movieGenres = movie.genre_ids
                    .map((id) => {
                      const genre = Moviegenres.find(
                        (genre) => genre.id === id
                      );
                      return genre ? genre.name : "Unknown Genre";
                    })
                    .join(", ");

                  return (
                    <tr
                      key={movie.id}
                      className="border-b-[1px] hover:bg-zinc-100"
                    >
                      <td className="flex gap-2 items-center p-4">
                        <img
                          className="h-[120px] w-[180px] rounded-lg"
                          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                          alt={movie.title}
                        />
                        <p>{movie.title}</p>
                      </td>
                      <td className="pl-5">{movie.vote_average}</td>
                      <td>{movie.release_date}</td>
                      <td className="text-center">
                        {movieGenres.split(", ").map((genre, i, arr) => (
                          <span
                            key={i}
                            className="text-center flex"
                          >
                            {genre}
                            {i < arr.length - 1 && ","}{" "}
                            
                          </span>
                        ))}
                      </td>

                      <td className="text-rose-500 cursor-pointer">
                        <FontAwesomeIcon
                          onClick={() => removeFromWatchlist(movie)}
                          icon={faTrash}
                        />
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Watchlist;
