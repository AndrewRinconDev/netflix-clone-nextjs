'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Movie } from '@/types/media'

interface SearchResultsProps {
  results: Movie[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="absolute mt-2 w-full bg-gray-900 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {results.length === 0 ? (
        <div className="p-4 text-gray-400">No results found</div>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id} className="border-b border-gray-800 last:border-0">
              <Link
                href={`/watch/${result.id}`}
                className="flex items-center p-3 hover:bg-gray-800 transition"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${result.imagePath}`}
                    alt={result.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-medium">{result.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {result.synopsis}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}