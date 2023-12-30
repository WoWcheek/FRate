import { useState, useEffect } from "react";

function average(arr) {
   return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
}

const KEY = "60348efc";

export default function App() {
   const [query, setQuery] = useState("");
   const [movies, setMovies] = useState([]);
   const [watched, setWatched] = useState([]);
   const [selectedId, setSelectedId] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   function handleSelectMovie(id) {
      setSelectedId((selectedId) => (id === selectedId ? null : id));
   }

   function handleCloseMovie() {
      setSelectedId(null);
   }

   useEffect(
      function () {
         async function awaitMovies() {
            try {
               setIsLoading(true);
               setError("");
               const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${KEY}`);
               const data = await res.json();

               if (data.Response === "False") throw new Error("Movie not found");

               setMovies(data.Search);
            } catch (err) {
               console.error(err.message);
               setError(err.message);
            } finally {
               setIsLoading(false);
            }
         }

         if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
         }

         awaitMovies();
      },
      [query]
   );

   return (
      <>
         <NavBar>
            <Logo />
            <Search query={query} setQuery={setQuery} />
            <SearchNumResults movies={movies} />
         </NavBar>

         <Main>
            <Box>
               {isLoading && <Loader />}
               {!isLoading && !error && (
                  <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
               )}
               {error && <ErrorMessage message={error} />}
            </Box>

            <Box>
               {selectedId ? (
                  <SelectedMovie selectedId={selectedId} onCloseMovie={handleCloseMovie} />
               ) : (
                  <>
                     <WatchedSummary watched={watched} />
                     <WatchedList watched={watched} />
                  </>
               )}
            </Box>
         </Main>
      </>
   );
}

function Loader() {
   return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
   return (
      <p className="error">
         <span>🛑</span>
         {message}
      </p>
   );
}

function NavBar({ children }) {
   return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
   return (
      <div className="logo">
         <span role="img">🎬</span>
         <h1>FRate</h1>
      </div>
   );
}

function Search({ query, setQuery }) {
   return (
      <input
         className="search"
         type="text"
         placeholder="Search movies..."
         value={query}
         onChange={(e) => setQuery(e.target.value)}
      />
   );
}

function SearchNumResults({ movies }) {
   return (
      <p className="num-results">
         Found <strong>{movies.length}</strong> results
      </p>
   );
}

function Main({ children }) {
   return <main className="main">{children}</main>;
}

function Box({ children }) {
   const [isOpen, setIsOpen] = useState(true);

   return (
      <div className="box">
         <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? "-" : "+"}
         </button>
         {isOpen && children}
      </div>
   );
}

function MovieList({ movies, onSelectMovie }) {
   return (
      <ul className="list list-movies">
         {movies?.map((movie) => (
            <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
         ))}
      </ul>
   );
}

function Movie({ movie, onSelectMovie }) {
   return (
      <li onClick={() => onSelectMovie(movie.imdbID)}>
         <img src={movie.Poster} alt={`${movie.Title} poster`} />
         <h3>{movie.Title}</h3>
         <div>
            <p>
               <span>📅</span>
               <span>{movie.Year}</span>
            </p>
         </div>
      </li>
   );
}

function SelectedMovie({ selectedId, onCloseMovie }) {
   return (
      <div className="details">
         <button className="btn-back" onClick={onCloseMovie}>
            &larr;
         </button>
      </div>
   );
}

function WatchedSummary({ watched }) {
   const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
   const avgUserRating = average(watched.map((movie) => movie.userRating));
   const avgRuntime = average(watched.map((movie) => movie.runtime));

   return (
      <div className="summary">
         <h2>Movies you watched</h2>
         <div>
            <p>
               <span>#️⃣</span>
               <span>{watched.length} movies</span>
            </p>
            <p>
               <span>⭐️</span>
               <span>{avgImdbRating}</span>
            </p>
            <p>
               <span>🌟</span>
               <span>{avgUserRating}</span>
            </p>
            <p>
               <span>⏳</span>
               <span>{avgRuntime} min</span>
            </p>
         </div>
      </div>
   );
}

function WatchedList({ watched }) {
   return (
      <ul className="list">
         {watched.map((movie) => (
            <WatchedMovie movie={movie} key={movie.imdbID} />
         ))}
      </ul>
   );
}

function WatchedMovie({ movie }) {
   return (
      <li>
         <img src={movie.Poster} alt={`${movie.Title} poster`} />
         <h3>{movie.Title}</h3>
         <div>
            <p>
               <span>⭐️</span>
               <span>{movie.imdbRating}</span>
            </p>
            <p>
               <span>🌟</span>
               <span>{movie.userRating}</span>
            </p>
            <p>
               <span>⏳</span>
               <span>{movie.runtime} min</span>
            </p>
         </div>
      </li>
   );
}
