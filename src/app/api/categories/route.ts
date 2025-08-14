import { NextRequest, NextResponse } from 'next/server';

import { GET_ALL_GENRES, GET_MOVIES_BY_GENRE } from '@/lib/gql/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '4');
    const pageState = searchParams.get('pageState');
    
    // Get genres from GraphQL
    const genresResponse = await fetch(`${request.nextUrl.origin}/api/graphql-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_ALL_GENRES,
        variables: {
          pageSize,
          pageState
        }
      })
    });

    if (!genresResponse.ok) {
      throw new Error('Failed to fetch genres');
    }

    const genresData = await genresResponse.json();
    
    if (genresData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(genresData.errors)}`);
    }

    const genres = genresData.data.genres.values;
    const nextPageState = genresData.data.genres.pageState;
    const hasMore = !!nextPageState;

    // Get movies for each genre
    const genresWithMovies = await Promise.all(
      genres.map(async (genre: { value: string }) => {
        const moviesResponse = await fetch(`${request.nextUrl.origin}/api/graphql-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_MOVIES_BY_GENRE,
            variables: {
              genre: genre.value
            }
          })
        });

        if (!moviesResponse.ok) {
          console.error(`Failed to fetch movies for genre: ${genre.value}`);
          return {
            id: Math.random(), // Generate temporary ID
            value: genre.value,
            label: genre.value,
            movies: []
          };
        }

        const moviesData = await moviesResponse.json();
        
        if (moviesData.errors) {
          console.error(`GraphQL errors for genre ${genre.value}:`, moviesData.errors);
          return {
            id: Math.random(),
            value: genre.value,
            label: genre.value,
            movies: []
          };
        }

        const movies = moviesData.data.movies.values.map((movie: any) => ({
          ...movie,
          voteAverage: 8.0, // Default value since it's not in the query
          thumbnail: movie.thumbnail || `/videos/${movie.title.toLowerCase().replace(/\s+/g, '_')}.mp4`
        }));

        return {
          id: Math.random(), // Generate temporary ID
          value: genre.value,
          label: genre.value,
          movies: movies.slice(0, 20) // Limit movies per genre
        };
      })
    );

    return NextResponse.json({
      genres: {
        values: genresWithMovies,
        pageState: nextPageState,
        hasMore
      }
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

