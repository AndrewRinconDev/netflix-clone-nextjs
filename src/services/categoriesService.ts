import { config, buildApiUrl } from "@/utils/config";
import { IGenreResponse } from "@/hooks/useCategories";

/**
 * Service class for managing categories data operations
 * Handles all API calls related to categories and movies
 */
export class CategoriesService {
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

export const getInitialCategories = CategoriesService.getInitialCategories;
export const getCategories = CategoriesService.getCategories;
export const getCategoryByValue = CategoriesService.getCategoryByValue;
