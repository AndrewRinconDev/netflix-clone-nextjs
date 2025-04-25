import type { Movie } from '@/types/media'
import { PlayButton, InfoButton } from '@/components/ui/Button'

interface HeroBannerProps {
  media: Movie
}

export default function HeroBanner({ media }: HeroBannerProps) {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
      <img
        src={`https://image.tmdb.org/t/p/original${media.imagePath}`}
        alt={media.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1/3 left-16 z-20 max-w-lg">
        <h1 className="text-5xl font-bold mb-4">{media.title}</h1>
        <p className="text-lg mb-6">{media.synopsis}</p>
        <div className="flex space-x-4">
          <PlayButton />
          <InfoButton mediaId={media.id} />
        </div>
      </div>
    </div>
  )
}