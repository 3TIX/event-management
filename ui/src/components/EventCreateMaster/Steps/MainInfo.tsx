import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  VStack,
} from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../EventCreateMaster"
import React, { useCallback } from "react"
import { NextButton } from "../NextButton"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { CURRENCIES } from "../../../utils/constants"

export const MainInfo = ({ onNextClick, state, dispatch }: StepProps) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.value })
    },
    [dispatch]
  )

  const handleCurrencySelect = useCallback(
    (value: string) => {
      dispatch({ fieldName: "ticketCurrency", value })
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
    <form
      onSubmit={onSubmit}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <VStack spacing={4} flex={1}>
        <MasterField title="Event name">
          <Input
            isRequired
            onChange={handleChange}
            name="name"
            value={state.name}
            mt={0}
            size="sm"
            variant="unstyled"
          />
        </MasterField>
        <MasterField title="Number of tickets">
          <Input
            isRequired
            type="number"
            name="ticketCount"
            value={state.ticketCount}
            onChange={handleChange}
            variant="unstyled"
          />
        </MasterField>
        <MasterField title="Ticket price">
          <Input
            isRequired
            flex={1}
            name="ticketPrice"
            value={state.ticketPrice}
            onChange={handleChange}
            variant="unstyled"
            type="number"
            step={0.01}
          />
          <Menu>
            <MenuButton
              size="xs"
              p={2}
              colorScheme="transparent"
              variant="ghost"
              as={Button}
              rightIcon={<ChevronDownIcon width="16px" height="16px" />}
            >
              {CURRENCIES[state.ticketCurrency.toLowerCase()]}
            </MenuButton>
            <MenuList bgColor="modalBg" border="none">
              {Object.entries(CURRENCIES).map(([value, label]) => {
                return (
                  <MenuItem
                    _hover={{ bgColor: "black" }}
                    _focus={{ bgColor: "black" }}
                    key={label}
                    onClick={() => handleCurrencySelect(value)}
                  >
                    {label}
                  </MenuItem>
                )
              })}
            </MenuList>
          </Menu>
        </MasterField>
        <MasterField title="Resale royalty (%)">
          <Input
            isRequired
            name="royaltyPercentage"
            value={state.royaltyPercentage}
            onChange={handleChange}
            variant="unstyled"
            type="number"
            max={100}
            min={0}
          />
        </MasterField>
        <Spacer />
        <NextButton />
      </VStack>
    </form>
  )
}
