import { gql } from '@apollo/client'
import { MovieFields } from './fragments'

export const GET_ALL_GENRES = gql`
  query getAllGenres($pageSize: Int!, $pageState: String) {
      genres (
        value: { label: "genre"},
        options: { pageSize: $pageSize, pageState: $pageState}
      ) {
        values {
          value
        }
        pageState
      }
    }
`

export const GET_MOVIES_BY_GENRE = gql`
  query getMovieAction ($genre: String!) {
  # query getMovieAction ($genre: String!, $pageState: String) {
    movies (
      value: { genre: $genre },
      # orderBy: [year_DESC],
      # options: { pageSize: 6, pageState: $pageState}
    ) {
      values {...MovieFields}
      pageState
    }
  }
  ${MovieFields}
`

export const GET_MOVIES_BY_ID = gql`
  query getMovieById($id: Uuid!) {
    movies(value: { id: $id }) {
      values {...MovieFields}
    }
  }
  ${MovieFields}
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