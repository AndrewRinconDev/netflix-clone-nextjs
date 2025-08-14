/**
 * Main configuration object containing all app settings
 */
export const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  api: {
    categories: '/api/categories',
    graphqlProxy: '/api/graphql-proxy',
  },
  
  pagination: {
    defaultPageSize: 4,        // Default categories per page
    initialLoadSize: 2,        // Initial categories for SSR (faster display)
  },
  
  loading: {
    intersectionThreshold: 0.1,        // When to trigger lazy loading (10% visible)
    intersectionRootMargin: '200px 0px', // Pre-load margin for smooth UX
  },
  
  cache: {
    enableCache: true,                 // Whether to enable caching
    cacheTimeout: 5 * 60 * 1000,      // Cache timeout in milliseconds (5 minutes)
  }
} as const;

/**
 * Helper function to build complete API URLs with query parameters
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error('Endpoint must be a non-empty string');
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(normalizedEndpoint, config.baseUrl);
  
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  
  return url.toString();
};

export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};
