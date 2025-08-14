/**
 * Configuration for DetailPage optimizations
 * Contains essential settings for performance and user experience
 */

export const detailPageConfig = {
  // Apollo Client configuration for DetailPage queries
  apollo: {
    fetchPolicy: 'cache-first' as const,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: false,
  },
  
  // Image optimization settings
  images: {
    loading: 'eager' as const,
    decoding: 'async' as const,
  },
  
  // Skeleton animation settings
  skeleton: {
    shimmerDuration: '2s',
    shimmerDelay: '0s',
    shimmerEasing: 'linear',
  },
  
  // Caching strategies
  cache: {
    movieDataTTL: 300, // 5 minutes
    imageAssetsTTL: 3600, // 1 hour
  },
  
  // Error handling
  errors: {
    maxRetries: 3,
    retryDelay: 1000,
  },
} as const;

/**
 * Get optimized Apollo Client options for DetailPage queries
 * @returns Apollo Client query options optimized for performance
 */
export const getDetailPageApolloOptions = () => ({
  ...detailPageConfig.apollo,
  context: {
    priority: 'high',
    deduplication: true,
  },
});
