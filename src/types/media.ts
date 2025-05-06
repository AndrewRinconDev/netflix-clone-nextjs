export interface IMovie {
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
    values: IMovie[];
  };
}
export interface MediaListResponse {
  page: number;
  results: IMovie[];
  totalPages: number;
  totalResults: number;
}

export interface SearchResults {
  searchMedia: IMovie[];
}
