import { NextRequest, NextResponse } from 'next/server';
import { GET_ALL_GENRES, GET_ALL_GENRES_ALT, GET_ALL_GENRES_ORDERED, GET_MOVIES_BY_GENRE } from '@/lib/gql/queries';
import { getApolloClient } from '@/lib/apollo/client';
import { IGenreResponse, IMovie, IMovieResponse } from '@/types/media';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '4');
    const pageState = searchParams.get('pageState');
    const test = searchParams.get('test');
    
    // Test endpoint to verify pagination
    if (test === 'pagination') {
      const client = getApolloClient();
      
      // Test with original query
      const firstPage = await client.query<IGenreResponse>({
        query: GET_ALL_GENRES,
        variables: { pageSize: 2, pageState: null }
      });
      
      if (firstPage.data.genres.pageState) {
        const secondPage = await client.query<IGenreResponse>({
          query: GET_ALL_GENRES,
          variables: { pageSize: 2, pageState: firstPage.data.genres.pageState }
        });
      }
      
      // Test with alternative query
      const firstPageAlt = await client.query<IGenreResponse>({
        query: GET_ALL_GENRES_ALT,
        variables: { pageSize: 2, pageState: null }
      });
      
      if (firstPageAlt.data.genres.pageState) {
        const secondPageAlt = await client.query<IGenreResponse>({
          query: GET_ALL_GENRES_ALT,
          variables: { pageSize: 2, pageState: firstPageAlt.data.genres.pageState }
        });
      }
      
      // Test with ordered query
      const firstPageOrdered = await client.query<IGenreResponse>({
        query: GET_ALL_GENRES_ORDERED,
        variables: { pageSize: 2, pageState: null }
      });
      
      if (firstPageOrdered.data.genres.pageState) {
        const secondPageOrdered = await client.query<IGenreResponse>({
          query: GET_ALL_GENRES_ORDERED,
          variables: { pageSize: 2, pageState: firstPageOrdered.data.genres.pageState }
        });
      }
      
      return NextResponse.json({ 
        message: 'Pagination test completed for all three queries',
        originalQuery: {
          firstPage: {
            count: firstPage.data.genres.values.length,
            pageState: firstPage.data.genres.pageState,
            hasMore: !!firstPage.data.genres.pageState,
            genres: firstPage.data.genres.values.map(g => g.value)
          }
        },
        alternativeQuery: {
          firstPage: {
            count: firstPageAlt.data.genres.values.length,
            pageState: firstPageAlt.data.genres.pageState,
            hasMore: !!firstPageAlt.data.genres.pageState,
            genres: firstPageAlt.data.genres.values.map(g => g.value)
          }
        },
        orderedQuery: {
          firstPage: {
            count: firstPageOrdered.data.genres.values.length,
            pageState: firstPageOrdered.data.genres.pageState,
            hasMore: !!firstPageOrdered.data.genres.pageState,
            genres: firstPageOrdered.data.genres.values.map(g => g.value)
          }
        }
      });
    }
    
    const client = getApolloClient();
    
    // Get genres from GraphQL - try ordered query first, then fallback
    let genresResponse;
    try {
      genresResponse = await client.query<IGenreResponse>({
        query: GET_ALL_GENRES_ORDERED,
        variables: {
          pageSize,
          pageState
        }
      });
    } catch (error) {
      try {
        genresResponse = await client.query<IGenreResponse>({
          query: GET_ALL_GENRES_ALT,
          variables: {
            pageSize,
            pageState
          }
        });
      } catch (error2) {
        genresResponse = await client.query<IGenreResponse>({
          query: GET_ALL_GENRES,
          variables: {
            pageSize,
            pageState
          }
        });
      }
    }

    if (genresResponse.error) {
      console.error('GraphQL error:', genresResponse.error);
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
          console.error(`Error fetching movies for genre ${genre.value}:`, moviesResponse.error);
          return {
            id: Math.random(),
            value: genre.value,
            label: genre.value,
            movies: []
          };
        }

        const movies = moviesResponse.data.movies.values.map((movie: IMovie) => ({
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

    const response = {
      genres: {
        values: genresWithMovies,
        pageState: nextPageState,
        hasMore
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

