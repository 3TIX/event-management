import {
  Input,
  VStack,
  Switch,
  FormLabel,
  Spacer,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Button,
  MenuItem,
  HStack,
} from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../EventCreateMaster"
import React, { useCallback, useContext } from "react"
import { Web3Context } from "../../../contexts/Web3Context"
import { Web3Connect } from "../../Web3Connect"
import { NextButton } from "../NextButton"
import { ArrowRight, RocketTicket } from "../../Icon"
import { ChevronDownIcon } from "@chakra-ui/icons"

export const Parameters = ({ state, dispatch, onNextClick }: StepProps) => {
  const { account } = useContext(Web3Context)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.value })
    },
    [dispatch]
  )

  const handleIsOnlineSelect = useCallback(
    (value: boolean) => {
      dispatch({ fieldName: "isOnline", value })
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
        <MasterField title="Event symbol">
          <Input
            name="symbol"
            value={state.symbol}
            onChange={handleChange}
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
          <ArrowRight />
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
        <MasterField title="Event location">
          <Menu>
            <MenuButton
              size="xs"
              p={2}
              colorScheme="transparent"
              variant="ghost"
              as={Button}
              rightIcon={<ChevronDownIcon width="16px" height="16px" />}
            >
              {state.isOnline ? "Virtual" : "On-site"}
            </MenuButton>
            <MenuList bgColor="modalBg" border="none">
              <MenuItem
                _hover={{ bgColor: "black" }}
                _focus={{ bgColor: "black" }}
                onClick={() => handleIsOnlineSelect(true)}
              >
                Virtual
              </MenuItem>
              <MenuItem
                _hover={{ bgColor: "black" }}
                _focus={{ bgColor: "black" }}
                onClick={() => handleIsOnlineSelect(false)}
              >
                On-site
              </MenuItem>
            </MenuList>
          </Menu>
          <Input
            flex={1}
            onChange={handleChange}
            name="location"
            value={state.location}
            mt={0}
            size="sm"
            variant="unstyled"
          />
        </MasterField>
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
        <Spacer />
        <NextButton />
      </VStack>
    </form>
  )
}
