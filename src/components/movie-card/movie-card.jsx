import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
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
        <Card.Title className="movie-title">{movie.title}</Card.Title>

        {movie.description && (
          <Card.Text className="text-muted flex-grow-1">
            {movie.description.slice(0, 100)}...
          </Card.Text>
        )}

        <Button
          as={Link}
          to={`/movies/${movie.id}`}
          variant="outline-secondary"
          size="sm"
          className="ui-btn mt-3"
          >
          Open
        </Button>
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
};