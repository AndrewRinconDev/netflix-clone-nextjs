export interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  duration: number;
  synopsis: string;
  thumbnail: string;
  imagePath: string;
  voteAverage: number;
}

export interface IGenre {
  value: string;
}

export interface IGenreResponse {
  genres: {
    values: IGenre[];
    pageState: string | null;
  };
}
export interface IMovieResponse {
  movies: {
    values: Movie[];
  };
}
export interface MediaListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface SearchResults {
  searchMedia: Movie[];
}
