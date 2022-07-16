import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../TicketCreateMaster"
import React from "react"

export const MainInfo = ({ setStepIndex, stepsAmount }: StepProps) => {
  return (
    <VStack spacing="40px">
      <MasterField title="Event name">
        <Input mt={0} size="sm" variant="unstyled" />
      </MasterField>
      <HStack alignSelf="stretch">
        <MasterField title="Event starts" flex={1}>
          <Input mt={0} size="sm" variant="unstyled" type="date" />
        </MasterField>
        <MasterField title="Event ends" flex={1}>
          <Input mt={0} size="sm" variant="unstyled" type="date" />
        </MasterField>
      </HStack>
      <Box alignSelf="stretch">
        <MasterField title="Event location">
          <Input mt={0} size="sm" variant="unstyled" />
        </MasterField>
        <Text fontSize="xs" color="whiteAlpha.600" mx={4} my={1}>
          Add an URL to an online place or an address to an offline place
        </Text>
      </Box>
      <MasterField title="Contact email">
        <Input mt={0} size="sm" variant="unstyled" />
      </MasterField>

      <Button
        colorScheme="primary"
        color="black"
        width="100%"
        borderRadius="100px"
        onClick={() =>
          setStepIndex((currentIndex) =>
            currentIndex === stepsAmount ? currentIndex : currentIndex + 1
          )
        }
      >
        Next
      </Button>
    </VStack>
  )
}
