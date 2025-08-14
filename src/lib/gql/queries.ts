import { gql } from "@apollo/client";
import { MovieFields } from "./fragments";

export const GET_ALL_GENRES = gql`
  query getAllGenre($pageSize: Int, $pageState: String) {
    genres(
      value: { label: "genre" }
      options: { pageSize: $pageSize, pageState: $pageState }
    ) {
      values {
        value
      }
      pageState
    }
  }
`;

// Alternative query that might work better with Astra DB
export const GET_ALL_GENRES_ALT = gql`
  query getAllGenreAlt($pageSize: Int, $pageState: String) {
    genres(
      options: { pageSize: $pageSize, pageState: $pageState }
    ) {
      values {
        value
      }
      pageState
    }
  }
`;

// Query with explicit ordering for Astra DB
export const GET_ALL_GENRES_ORDERED = gql`
  query getAllGenreOrdered($pageSize: Int, $pageState: String) {
    genres(
      options: { pageSize: $pageSize, pageState: $pageState }
    ) {
      values {
        value
        label
      }
      pageState
    }
  }
`;

export const GET_MOVIES_BY_GENRE = gql`
  query getMovieByGenre($genre: String) {
    movies(value: { genre: $genre }) {
      values {
        ...MovieFields
      }
      pageState
    }
  }
  ${MovieFields}
`;

export const GET_MOVIES_BY_ID = gql`
  query getMovieById($id: Uuid!) {
    movies(value: { id: $id }) {
      values {
        ...MovieFields
      }
    }
  }
  ${MovieFields}
`;

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
`;

export const ADD_TO_LIST = gql`
  mutation AddToList($mediaId: ID!) {
    addToList(mediaId: $mediaId) {
      success
      message
    }
  }
`;
