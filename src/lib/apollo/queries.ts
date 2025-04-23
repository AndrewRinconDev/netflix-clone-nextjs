import { gql } from '@apollo/client'

export const GET_HOME_PAGE_DATA = gql`
  query GetHomePageData {
    heroBanner {
      id
      title
      overview
      backdropPath
    }
    trendingNow {
      id
      title
      posterPath
    }
    topRated {
      id
      title
      posterPath
    }
  }
`

export const GET_MEDIA_DETAIL = gql`
  query GetMediaDetail($id: ID!) {
    media(id: $id) {
      id
      title
      overview
      backdropPath
      posterPath
      releaseDate
      runtime
      voteAverage
      genres {
        id
        name
      }
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