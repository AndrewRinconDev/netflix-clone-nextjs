import { NextRequest, NextResponse } from 'next/server';
import { GET_ALL_GENRES, GET_MOVIES_BY_GENRE } from '@/lib/gql/queries';
import { getApolloClient } from '@/lib/apollo/client';
import { IGenreResponse, IMovieResponse } from '@/types/media';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '4');
    const pageState = searchParams.get('pageState');
    const client = getApolloClient();
    
    // Get genres from GraphQL
    const genresResponse = await client.query<IGenreResponse>({
      query: GET_ALL_GENRES,
      variables: {
        pageSize,
        pageState
      }
    });


    if (genresResponse.error) {
      throw new Error(`GraphQL errors: ${JSON.stringify(genresResponse.error)}`);
    }

    const genres = genresResponse.data.genres.values;
    const nextPageState = genresResponse.data.genres.pageState;
    const hasMore = !!nextPageState;

    // Get movies for each genre
    const genresWithMovies = await Promise.all(
      genres.map(async (genre: { value: string }) => {
        const moviesResponse = await client.query<IMovieResponse>({
          query: GET_MOVIES_BY_GENRE,
          variables: {
            genre: genre.value
          }
        });

        if (moviesResponse.error) {
          return {
            id: Math.random(),
            value: genre.value,
            label: genre.value,
            movies: []
          };
        }

        const movies = moviesResponse.data.movies.values.map((movie: any) => ({
          ...movie,
          voteAverage: movie.voteAverage || 8.0, // Use the value from the fragment
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

