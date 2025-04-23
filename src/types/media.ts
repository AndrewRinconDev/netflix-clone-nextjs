export interface Media {
  id: string
  title: string
  overview: string
  posterPath: string
  backdropPath: string
  mediaType?: 'movie' | 'tv'
  releaseDate?: string
  runtime?: number
  voteAverage?: number
  genres?: Genre[]
}

export interface Genre {
  id: number
  name: string
}

export interface MediaListResponse {
  page: number
  results: Media[]
  totalPages: number
  totalResults: number
}

export interface SearchResults {
  searchMedia: Media[]
}