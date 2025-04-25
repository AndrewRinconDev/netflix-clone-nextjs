import { gql } from "@apollo/client";

export const MovieFields = gql`
  fragment MovieFields on movies_by_genre {
    # id,
    genre,
    year,
    title,
    duration,
    synopsis,
    thumbnail,
    # imageUrl
  }
`;