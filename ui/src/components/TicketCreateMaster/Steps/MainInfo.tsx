import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../TicketCreateMaster"
import React, { FormEvent, useCallback } from "react"
import { NextButton } from "../NextButton"

export const MainInfo = ({ onNextClick, state, dispatch }: StepProps) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.value })
    },
    [dispatch]
  )

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      onNextClick()
    },
    [onNextClick]
  )

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing="40px">
        <MasterField title="Event name">
          <Input
            onChange={handleChange}
            name="name"
            value={state.name}
            mt={0}
            size="sm"
            variant="unstyled"
          />
        </MasterField>
        <HStack alignSelf="stretch">
          <MasterField title="Event starts" flex={1}>
            <Input
              onChange={handleChange}
              name="startDate"
              value={state.startDate}
              mt={0}
              size="sm"
              variant="unstyled"
              type="date"
            />
          </MasterField>
          <MasterField title="Event ends" flex={1}>
            <Input
              onChange={handleChange}
              name="endDate"
              value={state.endDate}
              mt={0}
              size="sm"
              variant="unstyled"
              type="date"
            />
          </MasterField>
        </HStack>
        <Box alignSelf="stretch">
          <MasterField title="Event location">
            <Input
              onChange={handleChange}
              name="location"
              value={state.location}
              mt={0}
              size="sm"
              variant="unstyled"
            />
          </MasterField>
          <Text fontSize="xs" color="whiteAlpha.600" mx={4} my={1}>
            Add an URL to an online place or an address to an offline place
          </Text>
        </Box>
        <MasterField title="Contact email">
          <Input
            onChange={handleChange}
            name="organiserEmail"
            value={state.organiserEmail}
            mt={0}
            size="sm"
            variant="unstyled"
          />
        </MasterField>

        <NextButton />
      </VStack>
    </form>
  )
}
