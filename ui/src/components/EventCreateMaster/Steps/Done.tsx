import { HStack, Image, Text, VStack } from "@chakra-ui/react"
import React from "react"
import { StepProps } from "../EventCreateMaster"
import { Check } from "../../Icon"
import { NextButton } from "../NextButton"

export const Done = ({ state, onNextClick }: StepProps) => {
  return (
    <VStack spacing="40px">
      <Image src="assets/TicketFull.png" width="70%" />
      <HStack bgColor="primary.5" px={4} borderRadius="12px">
        <Text fontSize="3xl">{state.ticketCount}</Text>
        <Check />
      </HStack>
      <NextButton onClick={onNextClick}>Done</NextButton>
    </VStack>
  )
}
