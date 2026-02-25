import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Footer } from "../footer/footer";

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

  const [authMode, setAuthMode] = useState("login");

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
        setError("");
      })
      .catch((err) => {
        if (String(err.message || err).includes("401")) {
          handleLogout();
          return;
        }
        setError(String(err.message || err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setError("");
    setSelectedMovie(null);
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

  const goHome = () => {
    setSelectedMovie(null);
    setError("");
    if (!token) setAuthMode("login");
  };

  const navbar = (
    <NavigationBar
      isLoggedIn={Boolean(token)}
      onLogout={handleLogout}
      onHome={goHome}
      onShowLogin={() => setAuthMode("login")}
    />
  );

  // Logged out view
  if (!token) {
    return (
      <>
        {navbar}

        <Container fluid="md" className="py-3">
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={7} lg={5} xxl={4}>
              {authMode === "login" ? (
                <>
                  <LoginView apiUrl={API_URL} onLoggedIn={handleLoggedIn} />

                  <div className="d-grid mt-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="ui-btn w-100"
                      onClick={() => setAuthMode("signup")}
                    >
                      Need an account? Sign up.
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <SignupView
                    apiUrl={API_URL}
                    onSignedUp={() => setAuthMode("login")}
                  />

                  <div className="d-grid mt-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="ui-btn w-100"
                      onClick={() => setAuthMode("login")}
                    >
                      Already have an account? Log in.
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Container>
        <Footer />
      </>
    );
  }

  // Single movie view
  if (selectedMovie) {
    return (
      <>
        {navbar}
        <Container fluid="md" className="py-3">
          <MovieView movie={selectedMovie} onBackClick={goHome} />
        </Container>
        <Footer />
      </>
    );
  }

  // Error
  if (error) {
    return (
      <>
        {navbar}
        <Container fluid="md" className="py-3">
          <Alert variant="danger">Error loading movies: {error}</Alert>
        </Container>
        <Footer />
      </>
    );
  }

  // Loading
  if (movies.length === 0) {
    return (
      <>
        {navbar}
        <Container fluid="md" className="py-3">
          <div>Loading movies...</div>
        </Container>
        <Footer />
      </>
    );
  }

  // Movies grid
  return (
    <>
      {navbar}

      <Container fluid="md" className="py-3">
        <Row className="g-3">
          {movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xxl={2}>
              <MovieCard
                movie={movie}
                onMovieClick={(newSelectedMovie) =>
                  setSelectedMovie(newSelectedMovie)
                }
              />
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};