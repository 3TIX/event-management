import { Button, ButtonProps } from "@chakra-ui/react"
import React from "react"

type NextButtonProps = {
  setStepIndex: React.Dispatch<React.SetStateAction<number>>
  stepsAmount: number
}

export const NextButton = ({
  stepsAmount,
  setStepIndex,
  children,
  ...props
}: NextButtonProps & ButtonProps) => {
  return (
    <Button
      colorScheme="primary"
      color="black"
      width="100%"
      borderRadius="100px"
      onClick={() =>
        setStepIndex((currentIndex) => {
          return currentIndex === stepsAmount - 1
            ? currentIndex
            : currentIndex + 1
        })
      }
      {...props}
    >
      {children || "Next"}
    </Button>
  )
}
