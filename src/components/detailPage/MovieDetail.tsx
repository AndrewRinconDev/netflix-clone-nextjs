import { getMovieById } from "@/services/detailPageService";
import DetailPageWrapper from "@/components/detailPageWrapper/DetailPageWrapper";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

interface IMovieDetailProps {
  id: string;
}

/**
 * MovieDetail component handles data fetching and rendering
 * Separated from the page component for better separation of concerns
 */
async function MovieDetail({ id }: IMovieDetailProps) {
  try {
    const movie = await getMovieById(id);
    return <DetailPageWrapper movie={movie} />;
  } catch (error) {
    console.error('Error in MovieDetail:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to load movie details';
    
    return (
      <ErrorDisplay
        title="Failed to Load Movie"
        message={errorMessage}
        onRetry={() => window.history.back()}
        retryText="Go Back"
      />
    );
  }
}

export default MovieDetail;
