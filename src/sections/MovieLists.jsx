import React from 'react';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';

const MovieLists = ({ movieList, isLoading, errorMessage }) => {
  // ID film yang ingin dikecualikan
  const excludedMovieId = 1395724;

  // Filter movieList untuk mengecualikan film dengan ID tertentu
  const filteredMovies = movieList.filter(
    (movie) => movie.id !== excludedMovieId
  );

  return (
    <section className="all-movies">
      <h2 className="mt-[40px]">All Movies</h2>
      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <ul>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default MovieLists;
