'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Media } from '@/types/media'
import { PlayButton, AddToListButton } from '../ui/Button'
import { Info, Star, Clock, Calendar } from 'lucide-react'

export default function MediaDetail({ media }: { media: Media }) {
  const [showFullOverview, setShowFullOverview] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
        <Image
          src={`https://image.tmdb.org/t/p/original${media.backdropPath}`}
          alt={media.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Title and Metadata */}
          <h1 className="text-5xl font-bold mb-4">{media.title}</h1>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star className="mr-1" />
              <span>{media.voteAverage?.toFixed(1)}/10</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="mr-1" />
              <span>{media.runtime} min</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="mr-1" />
              <span>{media.releaseDate}</span>
            </div>
          </div>

          {/* Genres */}
          {media.genres && media.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {media.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <PlayButton />
            <AddToListButton mediaId={media.id} />
          </div>

          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className={`text-gray-300 ${showFullOverview ? '' : 'line-clamp-3'}`}>
              {media.overview}
            </p>
            <button
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="text-gray-400 hover:text-white mt-2 flex items-center"
            >
              <Info className="mr-1 h-4 w-4" />
              {showFullOverview ? 'Show less' : 'Show more'}
            </button>
          </div>

          {/* Poster (for larger screens) */}
          <div className="hidden lg:block absolute right-0 top-0 -translate-y-1/3">
            <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
                alt={media.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}