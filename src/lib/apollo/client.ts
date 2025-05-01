import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { useMemo } from "react";

import { getBaseUrl } from "@/utils/getBaseUrl";
import { isServerSide } from "@/utils/isServerSide";

const httpLink = new HttpLink({
  uri: `${getBaseUrl()}/api/graphql-proxy`,
  fetchOptions: { cache: 'no-store' }
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      "X-Cassandra-Token": process.env.NEXT_PUBLIC_ASTRA_DB_TOKEN,
    },
  });
  return forward(operation);
});

let client: ApolloClient<unknown> | null = null;

export function getApolloClient() {
  if (client) return client

  return new ApolloClient({
    ssrMode: isServerSide(),
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            reference_list: {
              keyArgs: false,
              merge(existing = { values: [] }, incoming) {
                return {
                  values: [...existing.values, ...incoming.values],
                  pageState: incoming.pageState,
                };
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState: unknown | null = null) {
  const _client = client ?? getApolloClient();

  if (initialState) {
    _client.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _client;
  if (!client) client = _client;

  return _client;
}

export function useApollo(initialState: unknown | null) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
