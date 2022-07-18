import * as React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { Web3ContextProvider } from "./contexts/Web3Context"
import { theme } from "./theme"
import { CreateTickets } from "./pages/CreateTickets"

export const App = () => (
  <Web3ContextProvider>
    <ChakraProvider theme={theme}>
      <CreateTickets />
    </ChakraProvider>
  </Web3ContextProvider>
)
