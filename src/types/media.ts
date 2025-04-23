export interface Media {
  id: string
  title: string
  genre: string,
  year: number
  duration: number
  synopsis: string
  thumbnail: string
  imageUrl: string,
  voteAverage: number
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