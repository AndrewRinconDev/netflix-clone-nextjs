import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const getClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            trendingNow: {
              merge(existing = [], incoming) {
                return [...existing, ...incoming]
              },
            },
          },
        },
        Media: {
          keyFields: ["id"],
          fields: {
            //TODO: Configuration for Media fields
          },
        },
      },
    }),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_ASTRA_GRAPHQL_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        "x-cassandra-token": process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || "",
      },
    }),
  })
}