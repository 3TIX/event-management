import {
  Input,
  VStack,
  Select,
  Switch,
  FormLabel,
  HStack,
  Spacer,
  Flex,
  Button,
} from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import { StepProps } from "../TicketCreateMaster"
import React, { useContext } from "react"
import { Web3Context } from "../../../contexts/Web3Context"
import { Web3Connect } from "../../Web3Connect"
import { NextButton } from "../NextButton"

export const Parameters = ({ setStepIndex, stepsAmount }: StepProps) => {
  const { account } = useContext(Web3Context)
  return (
    <VStack spacing="40px">
      <MasterField>
        <Flex width="100%">
          <FormLabel htmlFor="isOnline" m={0}>
            Is online
          </FormLabel>
          <Spacer />
          <Switch id="isOnline" isChecked />
        </Flex>
      </MasterField>
      <MasterField title="Number of tickets">
        <Input variant="unstyled" value={0} />
      </MasterField>
      <MasterField title="Ticket price">
        <Input variant="unstyled" type="number" value={0} step={0.01} />
      </MasterField>
      <MasterField title="Ticket currency">
        <Select placeholder="Select option" variant="unstyled">
          <option value="USDC">USDC</option>
          <option value="WETH">WETH</option>
          <option value="DAI">DAI</option>
          <option value="WBTC">WBTC</option>
        </Select>
      </MasterField>
      <MasterField title="Loyalty percentage">
        <Input variant="unstyled" type="number" max={100} min={0} value={0} />
      </MasterField>

      {account ? (
        <NextButton stepsAmount={stepsAmount} setStepIndex={setStepIndex} />
      ) : (
        <Web3Connect variant="solid" width="100%" color="black" />
      )}
    </VStack>
  )
}
