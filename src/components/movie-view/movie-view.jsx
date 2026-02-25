import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

export const MovieView = ({ movie, onBackClick }) => {
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
            variant="outline-secondary"
            size="sm"
            onClick={onBackClick}
            className="ui-btn mb-4"
            >
        Back
      </Button>
    </div>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
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
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};