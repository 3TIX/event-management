import * as React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { Web3ContextProvider } from "./contexts/Web3Context"
import { theme } from "./theme"
import { CreateTickets } from "./pages/CreateTickets"
import { FixedPageBackground } from "./components/FixedPageBackground"
import { ApolloProvider } from "@apollo/client"
import { client } from "./graphql"
import { Events } from "./pages/Events"

export const App = () => (
  <Web3ContextProvider>
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <CreateTickets />
        <FixedPageBackground />
        <Events />
      </ChakraProvider>
    </ApolloProvider>
  </Web3ContextProvider>
)
