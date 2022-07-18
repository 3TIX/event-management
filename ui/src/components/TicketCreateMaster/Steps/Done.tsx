import { Text, VStack } from "@chakra-ui/react"
import React from "react"

export const Done = () => {
  return (
    <VStack spacing="40px" alignItems="flex-start" flex={1}>
      <Text fontSize="9xl" color="red">
        Done
      </Text>
    </VStack>
  )
}
