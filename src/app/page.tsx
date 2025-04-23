import { getClient } from '@/lib/apollo/client'
import { GET_HOME_PAGE_DATA } from '@/lib/apollo/queries'
import HeroBanner from '@/components/hero/HeroBanner'
import MediaRow from '@/components/media/MediaRow'

export default async function HomePage() {
  const { data } = await getClient().query({
    query: GET_HOME_PAGE_DATA,
  });

  return (
    <>
      <HeroBanner media={data.heroBanner} />
      <div className="mt-8 space-y-8">
        <MediaRow title="Trending Now" items={data.trendingNow} />
        <MediaRow title="Top Rated" items={data.topRated} />
      </div>
    </>
  )
}