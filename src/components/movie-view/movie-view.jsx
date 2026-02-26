import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { useParams, Link } from "react-router-dom";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();

  const movie = movies.find(
    (m) => String(m.id) === String(movieId)
  );

  if (!movie) {
    return (
      <div>
        <Button
          as={Link}
          to="/"
          variant="outline-secondary"
          size="sm"
          className="ui-btn mb-4"
          >
          Back
        </Button>

        <div>Movie not found.</div>
      </div>
    );
  }

  return (
    <div>
      <h2>{movie.title}</h2>

      {movie.image && (
        <img
          src={movie.image}
          alt={`${movie.title} poster`}
          style={{
            width: "250px",
            maxWidth: "100%",
            display: "block",
            marginBottom: "1rem",
          }}
        />
      )}

      {movie.description && <p>{movie.description}</p>}

      <p>
        <strong>Genre:</strong> {movie.genre?.name}
      </p>

      <p>
        <strong>Director:</strong> {movie.director?.name}
      </p>

            <Button
        as={Link}
        to="/"
        variant="outline-secondary"
        size="sm"
        className="ui-btn mb-4"
        >
        Back
            </Button>
    </div>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      genre: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
      }),
      director: PropTypes.shape({
        name: PropTypes.string,
        bio: PropTypes.string,
        birthYear: PropTypes.string,
      }),
    })
  ).isRequired,
};