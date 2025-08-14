/**
 * Configuration file for environment variables and app settings
 * Centralizes all configuration values for easy maintenance
 */
export const config = {
  // Base URL for API calls
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  // API endpoints
  api: {
    categories: '/api/categories',
    graphqlProxy: '/api/graphql-proxy',
  },
  
  // Pagination settings
  pagination: {
    defaultPageSize: 4,
    initialLoadSize: 2, // Load only 2 categories initially for faster display
  },
  
  // Loading settings
  loading: {
    intersectionThreshold: 0.1,
    intersectionRootMargin: '200px 0px',
  },
  
  // Cache settings
  cache: {
    enableCache: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
  }
};

/**
 * Helper function to build API URLs with query parameters
 * @param endpoint - API endpoint path
 * @param params - Query parameters object
 * @returns Complete API URL string
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  const url = new URL(endpoint, config.baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }
  
  return url.toString();
};
