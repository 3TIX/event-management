import {
  Input,
  VStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  Button,
  MenuItem,
  HStack,
  Text,
  Switch,
} from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../EventCreateMaster"
import React, { useCallback } from "react"
import { NextButton } from "../NextButton"
import { ArrowRight } from "../../Icon"
import { ChevronDownIcon } from "@chakra-ui/icons"

export const Parameters = ({ state, dispatch, onNextClick }: StepProps) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.value })
    },
    [dispatch]
  )

  const handleSwitchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.checked })
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
            isRequired
            name="symbol"
            value={state.symbol}
            onChange={handleChange}
            variant="unstyled"
          />
        </MasterField>
        <HStack alignSelf="stretch">
          <MasterField title="Event starts" flex={1}>
            <Input
              isRequired
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
              isRequired
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
          <Input
            isRequired
            flex={1}
            onChange={handleChange}
            name="location"
            value={state.location}
            mt={0}
            size="sm"
            variant="unstyled"
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
        </MasterField>
        <MasterField title="Contact email">
          <Input
            isRequired
            onChange={handleChange}
            name="organiserEmail"
            value={state.organiserEmail}
            mt={0}
            size="sm"
            variant="unstyled"
          />
        </MasterField>
        <MasterField title="Distribute POAPs">
          <Text fontSize="sm" mr={2}>
            No
          </Text>
          <Switch
            name="distributePoaps"
            isChecked={state.distributePoaps}
            onChange={handleSwitchChange}
          />
          <Text fontSize="sm" ml={2}>
            Yes
          </Text>
        </MasterField>
        <Spacer />
        <NextButton />
      </VStack>
    </form>
  )
}
