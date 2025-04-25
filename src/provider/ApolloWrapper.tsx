import { ApolloProvider } from "@apollo/client";

import { apolloClient } from "@/lib/apollo/client";

export default function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}