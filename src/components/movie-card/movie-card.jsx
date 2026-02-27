import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export const MovieCard = ({
  movie,
  user,
  token,
  apiUrl,
  onUserUpdated,
  onBeforeUnfavorite,
  onAfterUnfavorite,
}) => {
  const isFavorite = Boolean(
    user?.FavoriteMovies?.includes(movie.id)
  );

  const toggleFavorite = () => {
    if (!user?.Username || !token) return;

    const method = isFavorite ? "DELETE" : "POST";

    if (isFavorite && onBeforeUnfavorite) {
      onBeforeUnfavorite();
    }

    fetch(`${apiUrl}/users/${user.Username}/movies/${movie.id}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }

        const updatedUser = data || user;

        if (onUserUpdated) onUserUpdated(updatedUser);

        // 🔥 Trigger removal cleanup AFTER update
        if (isFavorite && onAfterUnfavorite) {
          onAfterUnfavorite();
        }
      })
      .catch((err) => {
        console.error("Favorite toggle failed:", err);
      });
  };

  return (
    <Card className="h-100 shadow-sm">
      {movie.image && (
        <Card.Img
          variant="top"
          src={movie.image}
          alt={movie.title}
        />
      )}

      <Card.Body className="d-flex flex-column">
        <Card.Title className="movie-title">
          {movie.title}
        </Card.Title>

        {movie.description && (
          <Card.Text className="text-muted flex-grow-1">
            {movie.description.slice(0, 100)}...
          </Card.Text>
        )}

        <div className="d-flex align-items-center justify-content-between mt-3">
          <Button
            as={Link}
            to={`/movies/${movie.id}`}
            variant="outline-secondary"
            size="sm"
            className="ui-btn"
          >
            Open
          </Button>

          <Button
            variant="link"
            onClick={toggleFavorite}
            className="p-0"
            style={{
              textDecoration: "none",
              fontSize: "1.2rem",
            }}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <i
              className={`bi ${
                isFavorite ? "bi-heart-fill" : "bi-heart"
              }`}
            ></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  user: PropTypes.object,
  token: PropTypes.string,
  apiUrl: PropTypes.string,
  onUserUpdated: PropTypes.func,
  onBeforeUnfavorite: PropTypes.func,
  onAfterUnfavorite: PropTypes.func,
};