'use client'

import Image from 'next/image'
import type { Media } from '@/types/media'

interface MediaCardProps {
  media: Media
  onClick: () => void
}

function MediaCard({ media, onClick }: MediaCardProps) {
  return (
    <div
      className="relative h-48 min-w-[300px] cursor-pointer transition duration-200 ease-out hover:scale-105"
      onClick={onClick}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${media.imageUrl}`}
        alt={media.title}
        className="rounded object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h3 className="text-white font-semibold">{media.title}</h3>
      </div>
    </div>
  )
}

export default MediaCard
