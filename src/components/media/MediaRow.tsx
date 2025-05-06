'use client'

import { useRouter } from 'next/navigation'
import type { IMovie } from '@/types/media'
import MediaCard from './MediaCard'

interface MediaRowProps {
  title: string
  items: IMovie[]
}

export default function MediaRow({ title, items }: MediaRowProps) {
  const router = useRouter()

  return (
    <div className="pl-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            onClick={() => router.push(`/watch/${item.id}`)}
          />
        ))}
      </div>
    </div>
  )
}