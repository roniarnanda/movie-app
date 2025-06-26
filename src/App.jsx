import { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk mengambil data film dari API
  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Mengatur pesan error menjadi kosong sebelum melakukan permintaan

    try {
      // Menentukan endpoint untuk mengambil daftar film yang populer
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
    } catch (error) {
      console.error(`Error fetching movies: ${error}`); // Mencetak kesalahan ke konsol
      setErrorMessage('Error fetching movies, please try again later.'); // Mengatur pesan error untuk ditampilkan
    } finally {
      setIsLoading(false); // Mengatur status loading menjadi false setelah permintaan selesai
    }
  };

  // Menggunakan useEffect untuk memanggil fetchMovies saat komponen pertama kali dimuat
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <li key={movie.id} className="text-white">
                    {movie.title}
                  </li>
                ))}
              </ul>
            )}

            {/* {errorMessage && <p className="text-red-500"></p>} */}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
