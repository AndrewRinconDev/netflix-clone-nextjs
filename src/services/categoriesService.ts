import { config, buildApiUrl } from "@/utils/config";
import { IGenreResponse } from "@/hooks/useCategories";

/**
 * Fetches initial categories for SSR
 * @returns Promise<IGenreResponse | null>
 */
export async function getInitialCategories(): Promise<IGenreResponse | null> {
  try {
    const url = buildApiUrl(config.api.categories, {
      pageSize: config.pagination.initialLoadSize.toString()
    });

    const response = await fetch(url, {
      cache: 'no-store' // Ensure fresh data
    });

    if (!response.ok) {
      console.error('Failed to fetch initial categories');
      return null;
    }

    const data: IGenreResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching initial categories:', error);
    return null;
  }
}

/**
 * Fetches categories with pagination
 * @param pageSize - Number of categories to fetch
 * @param pageState - Pagination state for next page
 * @returns Promise<IGenreResponse | null>
 */
export async function getCategories(
  pageSize: number, 
  pageState?: string | null
): Promise<IGenreResponse | null> {
  try {
    const params: Record<string, string> = {
      pageSize: pageSize.toString()
    };

    if (pageState) {
      params.pageState = pageState;
    }

    const url = buildApiUrl(config.api.categories, params);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Failed to fetch categories');
      return null;
    }

    const data: IGenreResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}
