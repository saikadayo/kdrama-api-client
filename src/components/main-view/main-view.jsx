import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const pastLivesImg = new URL(
    "../../assets/images/pastlives.png",
    import.meta.url
  ).href;

  const parasiteImg = new URL(
    "../../assets/images/parasite.png",
    import.meta.url
  ).href;

  const handmaidenImg = new URL(
    "../../assets/images/thehandmaiden.png",
    import.meta.url
  ).href;

  const [movies] = useState([
    {
      id: 1,
      title: "Past Lives",
      description:
        "Two childhood friends reunite years later and reflect on fate, love, and the paths not taken.",
      image: pastLivesImg,
      director: {
        name: "Celine Song",
        bio: "She makes romance movies.",
        birthYear: "1988",
      },
      genre: {
        name: "Romance",
        description: "lovey dovey",
      },
    },
    {
      id: 2,
      title: "Parasite",
      description:
        "A struggling family infiltrates a wealthy household in a darkly comedic thriller about class division.",
      image: parasiteImg,
      director: {
        name: "Bong Joon Ho",
        bio: "He is a man who makes movies.",
        birthYear: "1969",
      },
      genre: {
        name: "Thriller",
        description: "spooky movies",
      },
    },
    {
      id: 3,
      title: "The Handmaiden",
      description:
        "A con man hires a pickpocket to become a wealthy heiress’s handmaiden as part of an elaborate scheme.",
      image: handmaidenImg,
      director: {
        name: "Park Chan-wook",
        bio: "He makes horror and romance films.",
        birthYear: "1963",
      },
      genre: {
        name: "Romance",
        description: "lovey dovey",
      },
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

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