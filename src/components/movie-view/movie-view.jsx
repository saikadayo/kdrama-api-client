export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <h2>{movie.title}</h2>

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

      <p>{movie.description}</p>

      <p>
        <strong>Genre:</strong> {movie.genre?.name}
      </p>

      <p>
        <strong>Director:</strong> {movie.director?.name}
      </p>

      <button onClick={onBackClick} style={{ marginTop: "1rem" }}>
        Back
      </button>
    </div>
  );
};