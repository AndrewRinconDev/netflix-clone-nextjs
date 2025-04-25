"use client";

// import { GET_MOVIES_BY_GENRE } from "@/lib/apollo/queries";
// import MediaDetail from "@/components/media/MediaDetail";
// import { useQuery } from "@apollo/client";
import { use } from "react";

interface IDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DetailPage = ({ params }: IDetailPageProps) => {
  // read route params
  const { id } = use(params);

  // const { loading, error, data } = useQuery({
  //   query: GET_MOVIES_BY_GENRE,
  //   variables: { id: params.id },
  // })
  // const { loading, error, data } = useQuery(GET_MOVIES_BY_GENRE, {
  //   // variables: { id: params.id },
  // })
  // if (loading) {
  //   return <div>Loading...</div>
  // }

  // if (!data?.media || error) {
  //   return notFound()
  // }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Detail Page</h1>
      <p className="mt-4">ID: {id}</p>
    </div>
  );
  // return <MediaDetail media={data.media} />
};

export default DetailPage;
