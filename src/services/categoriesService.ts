import { config, buildApiUrl } from "@/utils/config";
import { IGenreResponse } from "@/hooks/useCategories";

/**
 * Service class for managing categories data operations
 * Handles all API calls related to categories and movies
 */
export class CategoriesService {
  /**
   * Fetches initial categories for Server-Side Rendering (SSR)
   * This function is optimized for the first page load to show content quickly
   * @returns Promise<IGenreResponse | null> - Categories data or null if error
   * @throws Will not throw, returns null on error for graceful degradation
   */
  static async getInitialCategories(): Promise<IGenreResponse | null> {
    try {
      const url = buildApiUrl(config.api.categories, {
        pageSize: config.pagination.initialLoadSize.toString()
      });

      const response = await fetch(url, {
        cache: 'no-store', // Ensure fresh data for SSR
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch initial categories: ${response.status} ${response.statusText}`);
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
   * Fetches categories with pagination support
   * Used for lazy loading additional categories as user scrolls
   * @param pageSize - Number of categories to fetch per request
   * @param pageState - Pagination token for next page (optional)
   * @returns Promise<IGenreResponse | null> - Paginated categories data or null if error
   */
  static async getCategories(
    pageSize: number, 
    pageState?: string | null
  ): Promise<IGenreResponse | null> {
    try {
      // Validate input parameters
      if (pageSize <= 0) {
        console.error('Invalid pageSize: must be greater than 0');
        return null;
      }

      const params: Record<string, string> = {
        pageSize: pageSize.toString()
      };

      if (pageState) {
        params.pageState = pageState;
      }

      const url = buildApiUrl(config.api.categories, params);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        return null;
      }

      const data: IGenreResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return null;
    }
  }

  /**
   * Fetches a specific category by its value/name
   * Useful for getting detailed information about a single category
   * @param categoryValue - The category value/name to fetch
   * @returns Promise<IGenreResponse | null> - Category data or null if error
   */
  static async getCategoryByValue(categoryValue: string): Promise<IGenreResponse | null> {
    try {
      if (!categoryValue || categoryValue.trim() === '') {
        console.error('Invalid category value: cannot be empty');
        return null;
      }

      const url = buildApiUrl(config.api.categories, {
        pageSize: '1',
        category: categoryValue.trim()
      });

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch category ${categoryValue}: ${response.status} ${response.statusText}`);
        return null;
      }

      const data: IGenreResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching category ${categoryValue}:`, error);
      return null;
    }
  }
}

// Export individual functions for backward compatibility
export const getInitialCategories = CategoriesService.getInitialCategories;
export const getCategories = CategoriesService.getCategories;
export const getCategoryByValue = CategoriesService.getCategoryByValue;
