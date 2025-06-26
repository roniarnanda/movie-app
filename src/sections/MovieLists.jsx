import React from 'react';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';

const MovieLists = ({ movieList, isLoading, errorMessage }) => {
  return (
    <section className="all-movies">
      <h2 className="mt-[40px]">All Movies</h2>
      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <ul>
          {movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default MovieLists;
