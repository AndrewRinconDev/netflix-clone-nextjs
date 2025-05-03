import { gql } from "@apollo/client";

export const MovieFields = gql`
  fragment MovieFields on movies {
    id,
    genre,
    year,
    title,
    duration,
    synopsis,
    thumbnail,
    imagePath,
    voteAverage,
  }
`;