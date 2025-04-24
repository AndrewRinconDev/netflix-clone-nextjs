import { gql } from '@apollo/client'

export const GET_ALL_GENRES = gql`
  query getAllGenres($limit: Int!) {
      reference_list (
        value: { label: "genre"},
        options: { limit: $limit }
      ) {
        values {
          value
        }
      }
    }
`

export const GET_MOVIES_BY_GENRE = gql`
  query getMovieAction ($genre: String!, $pageState: String) {
    movies_by_genre (
      value: { genre: $genre },
      orderBy: [year_DESC],
      options: { pageSize: 6, pageState: $pageState}
    ) {
      values {
        year,
        title,
        duration,
        synopsis,
        thumbnail
      }
      pageState
    }
  }
`

export const SEARCH_MEDIA = gql`
  query SearchMedia($query: String!) {
    searchMedia(query: $query) {
      id
      title
      overview
      posterPath
      mediaType
    }
  }
`

export const ADD_TO_LIST = gql`
  mutation AddToList($mediaId: ID!) {
    addToList(mediaId: $mediaId) {
      success
      message
    }
  }
`