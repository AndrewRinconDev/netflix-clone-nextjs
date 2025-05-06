import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { getApolloClient } from "@/lib/apollo/client";
import { GET_MOVIES_BY_ID } from "@/lib/gql/queries";
import { IMovieResponse } from "@/types/media";

import DetailPageWrapper from "@/components/detailPageWrapper/DetailPageWrapper";

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
    <DetailPageWrapper movie={movie} />
  );
};

export default DetailPage;
