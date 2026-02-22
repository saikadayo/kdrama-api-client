import { useEffect, useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

const imagesByFilename = {
  "parasite.png": new URL("../../images/parasite.png", import.meta.url).href,
  "pastlives.png": new URL("../../images/pastlives.png", import.meta.url).href,
  "thehandmaiden.png": new URL("../../images/thehandmaiden.png", import.meta.url).href,
  "sympathyforMrVengeance.png": new URL("../../images/sympathyforMrVengeance.png", import.meta.url).href,
  "castawayonthemoon.png": new URL("../../images/castawayonthemoon.png", import.meta.url).href,
  "marathon.png": new URL("../../images/marathon.png", import.meta.url).href,
  "moonlitwinter.png": new URL("../../images/moonlitwinter.png", import.meta.url).href,
  "1987.png": new URL("../../images/1987.png", import.meta.url).href,
  "mother.png": new URL("../../images/mother.png", import.meta.url).href,
  "burning.png": new URL("../../images/burning.png", import.meta.url).href,
};

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const API_URL = "https://kdrama-api-b87cf2d2bb43.herokuapp.com";

    fetch(`${API_URL}/movies`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || `HTTP ${response.status}`);
        }

        if (!Array.isArray(data)) {
          throw new Error("API did not return an array of movies.");
        }

        const normalizedMovies = data.map((m, index) => ({
          id: m._id || `${m.Title}-${index}`,
          title: m.Title,
          description: m.Description,
          image: m.ImagePath ? imagesByFilename[m.ImagePath] || null : null,
          genre: {
            name: m.Genre?.Name,
            description: m.Genre?.Description,
          },
          director: {
            name: m.Director?.Name,
            bio: m.Director?.Bio,
            birthYear: m.Director?.Birth,
          },
        }));

        setMovies(normalizedMovies);
      })
      .catch((err) => {
        console.error("Failed to fetch movies:", err);
        setError(String(err.message || err));
      });
  }, []);

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  if (error) return <div>Error loading movies: {error}</div>;
  if (movies.length === 0) return <div>Loading movies...</div>;

  return (
    <div>
      <h1>My KDrama Movies</h1>

      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
        />
      ))}
    </div>
  );
};