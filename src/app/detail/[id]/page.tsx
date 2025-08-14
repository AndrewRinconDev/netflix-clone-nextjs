import { Suspense } from "react";
import MovieDetail from "@/components/detailPage/MovieDetail";
import DetailPageSkeleton from "@/components/skeletons/detailPageSkeleton/DetailPageSkeleton";

interface IDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * DetailPage component - Main page component for movie details
 * Uses Suspense for streaming and skeleton fallback
 */
const DetailPage = async ({ params }: IDetailPageProps) => {
  const { id } = await params;

  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <MovieDetail id={id} />
    </Suspense>
  );
};

export default DetailPage;
