import { Box, Flex, HStack } from "@chakra-ui/react"
import times from "lodash.times"

export type StepIndicatorProps = {
  stepsAmount: number
  currentStep: number
}

type StepDotProps = {
  isActive: boolean
}

const StepDot = ({ isActive }: StepDotProps) => {
  return (
    <Box
      borderRadius="4px"
      height="8px"
      width="8px"
      bgColor={isActive ? "primary" : "primaryInactive"}
    />
  )
}

export const StepIndicator = ({
  currentStep,
  stepsAmount,
}: StepIndicatorProps) => {
  return (
    <Flex justifyContent="center">
      <HStack spacing={2}>
        {times(stepsAmount, (index) => {
          return (
            <StepDot key={`dot.${index}`} isActive={index === currentStep} />
          )
        })}
      </HStack>
    </Flex>
  )
}
