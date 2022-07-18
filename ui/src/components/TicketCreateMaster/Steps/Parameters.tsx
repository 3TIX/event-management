import {
  Input,
  VStack,
  Select,
  Switch,
  FormLabel,
  Spacer,
  Flex,
} from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../TicketCreateMaster"
import React, { useCallback, useContext } from "react"
import { Web3Context } from "../../../contexts/Web3Context"
import { Web3Connect } from "../../Web3Connect"
import { NextButton } from "../NextButton"
import { RocketTicket } from "../../Icon"

export const Parameters = ({ state, dispatch, onNextClick }: StepProps) => {
  const { account } = useContext(Web3Context)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <MasterField>
          <Flex width="100%">
            <FormLabel htmlFor="isOnline" m={0}>
              Is online
            </FormLabel>
            <Spacer />
            <Switch
              name="isOnline"
              isChecked={state.isOnline}
              onChange={handleSwitchChange}
            />
          </Flex>
        </MasterField>
        <MasterField title="Event symbol">
          <Input
            name="symbol"
            value={state.symbol}
            onChange={handleChange}
            variant="unstyled"
          />
        </MasterField>
        <MasterField title="Number of tickets">
          <Input
            name="ticketCount"
            value={state.ticketCount}
            onChange={handleChange}
            variant="unstyled"
          />
        </MasterField>
        <MasterField title="Ticket price">
          <Input
            name="ticketPrice"
            value={state.ticketPrice}
            onChange={handleChange}
            variant="unstyled"
            type="number"
            step={0.01}
          />
        </MasterField>
        <MasterField title="Ticket currency">
          <Select
            name="ticketCurrency"
            value={state.ticketCurrency}
            onChange={handleChange}
            placeholder="Select option"
            variant="unstyled"
          >
            <option value="0x0000000000000000000000000000000000000000">
              MATIC
            </option>
            <option value="0x2d7882bedcbfddce29ba99965dd3cdf7fcb10a1e">
              TST
            </option>
            <option value="0x326c977e6efc84e512bb9c30f76e30c160ed06fb">
              LINK
            </option>
          </Select>
        </MasterField>
        <MasterField title="Loyalty percentage">
          <Input
            name="royaltyPercentage"
            value={state.royaltyPercentage}
            onChange={handleChange}
            variant="unstyled"
            type="number"
            max={100}
            min={0}
          />
        </MasterField>

        {account ? (
          <NextButton rightIcon={<RocketTicket />}>Create tickets</NextButton>
        ) : (
          <Web3Connect variant="solid" width="100%" color="black" />
        )}
      </VStack>
    </form>
  )
}
