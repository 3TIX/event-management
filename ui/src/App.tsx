import * as React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { Web3ContextProvider } from "./contexts/Web3Context"
import { theme } from "./theme"
import { CreateTickets } from "./pages/CreateTickets"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hackfs2022/subgraph",
  cache: new InMemoryCache(),
});

export const App = () => (
  <ApolloProvider client={client}>
    <Web3ContextProvider>
      <ChakraProvider theme={theme}>
        <CreateTickets />
      </ChakraProvider>
    </Web3ContextProvider>
  </ApolloProvider>
)
