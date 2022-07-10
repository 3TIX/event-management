import React from "react"
import { Box, Flex, Heading, VStack } from "@chakra-ui/react"
import { Web3Connect } from "../Web3Connect"

export const Main = () => {
  return (
    <Box textAlign="center" fontSize="xl">
      <VStack spacing={8}>
        <Flex
          bgColor="teal"
          minH="4rem"
          width="100%"
          flexDirection="row"
          alignItems="center"
          paddingX={8}
        >
          <Heading flex={1}>Header</Heading>
          <Web3Connect />
        </Flex>
      </VStack>
    </Box>
  )
}
