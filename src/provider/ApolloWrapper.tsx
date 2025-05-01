import { ApolloProvider } from "@apollo/client";

import { useApollo } from "@/lib/apollo/client";

interface ApolloWrapperProps {
  children?: React.ReactNode;
  initialState: unknown | null;
}

export default function ApolloWrapper({ children, initialState }: ApolloWrapperProps) {
  const client = useApollo(initialState);
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}