import { useEffect, useState } from 'react';
import Hero from './sections/Hero';
import Trending from './sections/Trending';
import MovieLists from './sections/MovieLists';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';

// Mendefinisikan URL dasar untuk API The Movie Database (TMDB)
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Mengambil API key dari variabel lingkungan yang telah ditentukan
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Mengatur opsi untuk permintaan API, termasuk metode dan header yang diperlukan
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // Mendefinisikan state untuk menyimpan istilah pencarian, pesan error, daftar film, dan status loading
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fungsi untuk mengambil data film dari API
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage(''); // Mengatur pesan error menjadi kosong sebelum melakukan permintaan

    try {
      // Menentukan endpoint untuk mengambil daftar film
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&region=JP&with_original_language=ja&include_adult=false&certification_country=JP&certification.lte=PG-18`;

      const response = await fetch(endpoint, API_OPTIONS); // Melakukan permintaan ke API

      if (!response.ok) {
        throw new Error('Failed to fetch movies'); // Menangani kesalahan jika respons tidak ok
      }

      const data = await response.json(); // Mengonversi respons menjadi format JSON

      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch Movies'); // Mengatur pesan error jika tidak ada film ditemukan
        setMovieList([]); // Mengatur daftar film menjadi kosong
      }
      setMovieList(data.results || []); // Mengatur daftar film dengan hasil yang diterima

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`); // Mencetak kesalahan ke konsol
      setErrorMessage('Error fetching movies, please try again later.'); // Mengatur pesan error untuk ditampilkan
    } finally {
      setIsLoading(false); // Mengatur status loading menjadi false setelah permintaan selesai
    }
  };

  // Menampilkan movie yang trending
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  // Menggunakan useEffect untuk memanggil fetchMovies saat komponen pertama kali dimuat
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {trendingMovies.length > 0 && (
            <Trending trendingMovies={trendingMovies} />
          )}

          <MovieLists
            movieList={movieList}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
