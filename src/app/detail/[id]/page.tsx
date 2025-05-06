import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { getApolloClient } from "@/lib/apollo/client";
import { GET_MOVIES_BY_ID } from "@/lib/gql/queries";
import { IMovieResponse } from "@/types/media";
import { IoIosStar } from "react-icons/io";
import { FaRegClock, FaPlay, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineLocalMovies } from "react-icons/md";

import "./page.styles.css";

// interface IDetailPageProps {
//   params: { id: string };
// }

interface IDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DetailPage = async ({ params }: IDetailPageProps) => {
  const { id } = await params;

  const client = getApolloClient();
  const { loading, error, data } = await client.query<IMovieResponse>({
    query: GET_MOVIES_BY_ID,
    variables: { id },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const movie = data.movies.values[0];
  if (!movie) return <div>No movie found</div>;

  return (
    <div className="detail-page-wrapper">
      <div className="image-container">
        <img
          src={`/images/movies/${movie.imagePath}`}
          alt={`${movie.title}-thumbnail`}
        />
        <div className="overlay"></div>
      </div>

      <div className="detail-container">
        <h1>{movie.title}</h1>
        <div className="detail-badges">
          <span className="badge">
            <MdOutlineLocalMovies />
            {movie.genre}
          </span>
          <span className="badge">
            <FaCalendarAlt />
            {movie.year}
          </span>
          <span className="badge">
            <FaRegClock />
            {movie.duration} min
          </span>
          <span className="badge">
            <IoIosStar />
            {movie.voteAverage}
          </span>
        </div>
        <p>{movie.synopsis}</p>
        <div className="detail-buttons">
          <button className="play-button">
            <FaPlay className="play-icon" />
            Watch Now
          </button>
        </div>
      </div>
      {/* Add more movie details as needed */}
      {/* player */}
      {/* <video className="video-player" controls autoPlay muted loop>
        <source src={movie.thumbnail} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <video
        className="video-player"
        controls
        autoPlay={true}
        loop
        poster={`/images/movies/${movie.imagePath}`}
      >
        <source src={movie.thumbnail} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default DetailPage;
