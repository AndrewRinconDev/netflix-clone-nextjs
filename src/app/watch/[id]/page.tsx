import { notFound } from 'next/navigation'
import { getClient } from '@/lib/apollo/client'
import { GET_MEDIA_DETAIL } from '@/lib/apollo/queries'
import MediaDetail from '@/components/media/MediaDetail'

interface PageProps {
  params: { id: string }
}

export default async function WatchPage({ params }: PageProps) {
  const { data, error } = await getClient().query({
    query: GET_MEDIA_DETAIL,
    variables: { id: params.id },
  })

  if (!data?.media || error) {
    return notFound()
  }

  return <MediaDetail media={data.media} />
}