import { useEffect, useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

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
  const API_URL = "https://kdrama-api-b87cf2d2bb43.herokuapp.com";

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/movies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

        // If token is invalid/expired, force logout flow
        if (String(err.message || err).includes("401")) {
          handleLogout();
          return;
        }

        setError(String(err.message || err));
      });
  }, [token]);

  const handleLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    setError("");
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    setMovies([]);
    setSelectedMovie(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setAuthMode("login");
    setError("");
  };

  if (!token) {
    return (
      <div>
        <h1>My KDrama Movies</h1>

        {authMode === "login" ? (
          <>
            <LoginView apiUrl={API_URL} onLoggedIn={handleLoggedIn} />

            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => setAuthMode("signup")}>
                Need an account? Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            <SignupView apiUrl={API_URL} onSignedUp={() => setAuthMode("login")} />

            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => setAuthMode("login")}>
                Already have an account? Log in
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

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

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

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