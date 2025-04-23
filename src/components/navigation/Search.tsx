'use client'

import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_MEDIA } from '@/lib/apollo/queries'
import SearchResults from './SearchResults'

export default function Search() {
  const [query, setQuery] = useState('')
  // const [searchMedia, { data, loading }] = useLazyQuery(SEARCH_MEDIA)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Uncomment the line below to enable search functionality
      // searchMedia({ variables: { query } })
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies or TV shows"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
      </form>
      {/* {loading && <div className="absolute mt-2 p-2 bg-gray-800 rounded">Loading...</div>}
      {data?.searchMedia && <SearchResults results={data.searchMedia} />} */}
    </div>
  )
}