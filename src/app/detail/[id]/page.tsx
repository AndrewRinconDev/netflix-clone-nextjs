import { notFound } from 'next/navigation'

// import { getClient } from '@/lib/apollo/client'
import { GET_MOVIES_BY_GENRE } from '@/lib/apollo/queries'
import MediaDetail from '@/components/media/MediaDetail'
import { useQuery } from '@apollo/client'

// interface PageProps {
//   params: { id: string }
// }

function DetailPage() {
  // const { loading, error, data } = useQuery({
  //   query: GET_MOVIES_BY_GENRE,
  //   variables: { id: params.id },
  // })
  const { loading, error, data } = useQuery(GET_MOVIES_BY_GENRE, {
    // variables: { id: params.id },
  })
  if (loading) {
    return <div>Loading...</div>
  }

  if (!data?.media || error) {
    return notFound()
  }

  return <MediaDetail media={data.media} />
}

export default DetailPage;
