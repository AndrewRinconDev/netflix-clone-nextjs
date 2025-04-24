import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: '/api/graphql-proxy',
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_TOKEN,
    }
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
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
});
