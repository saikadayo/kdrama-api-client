export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      onClick={() => {
        onMovieClick(movie);
      }}
      style={{ cursor: "pointer" }}
    >
      <h2>{movie.title}</h2>
    </div>
  );
};