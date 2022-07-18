import { StepProps } from "../TicketCreateMaster"
import { Spacer, Text, VStack } from "@chakra-ui/react"
import { NextButton } from "../NextButton"
import React from "react"
import { RocketTicket } from "../../Icon"

export const WIP = ({ onNextClick }: StepProps) => {
  return (
    <VStack spacing="40px" alignItems="flex-start" flex={1}>
      <Text fontSize="9xl" color="red">
        WIP
      </Text>
      <Spacer />
      <NextButton onClick={onNextClick} rightIcon={<RocketTicket />}>
        Create tickets
      </NextButton>
    </VStack>
  )
}
