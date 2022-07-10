import * as React from "react"
import { ChakraProvider, theme } from "@chakra-ui/react"
import { Main } from "./components/Main"
import { Web3ContextProvider } from "./contexts/Web3Context"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Web3ContextProvider>
      <Main />
    </Web3ContextProvider>
  </ChakraProvider>
)
