import { getApolloClient } from "@/lib/apollo/client";
import { GET_MOVIES_BY_ID } from "@/lib/gql/queries";
import { IMovieResponse, IMovie } from "@/types/media";

/**
 * Service class for DetailPage operations
 * Handles movie data fetching and business logic
 */
export class DetailPageService {
  /**
   * Fetches movie details by ID with optimized Apollo Client options
   * @param id - Movie ID to fetch
   * @returns Promise<IMovie> - Movie data or throws error
   */
  static async getMovieById(id: string): Promise<IMovie> {
    const client = getApolloClient();
    
    const { data, error } = await client.query<IMovieResponse>({
      query: GET_MOVIES_BY_ID,
      variables: { id },
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: false,
    });

    if (error) {
      throw new Error(`Failed to fetch movie: ${error.message}`);
    }

    const movie = data?.movies?.values?.[0];
    if (!movie) {
      throw new Error('Movie not found');
    }

    return movie;
  }

  /**
   * Validates movie data structure
   * @param movie - Movie object to validate
   * @returns boolean - True if valid, false otherwise
   */
  static validateMovie(movie: IMovie): boolean {
    return !!(
      movie.id &&
      movie.title &&
      movie.genre &&
      movie.year &&
      movie.duration &&
      movie.synopsis &&
      movie.imagePath
    );
  }

  /**
   * Formats movie duration for display
   * @param duration - Duration in minutes
   * @returns string - Formatted duration
   */
  static formatDuration(duration: number): string {
    if (duration < 60) {
      return `${duration} min`;
    }
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}min`;
  }

  /**
   * Formats vote average for display
   * @param voteAverage - Vote average value
   * @returns string - Formatted vote average
   */
  static formatVoteAverage(voteAverage: number): string {
    return voteAverage.toFixed(1);
  }
}

// Export individual functions for convenience
export const getMovieById = DetailPageService.getMovieById;
export const validateMovie = DetailPageService.validateMovie;
export const formatDuration = DetailPageService.formatDuration;
export const formatVoteAverage = DetailPageService.formatVoteAverage;
