import { Button, ButtonProps } from "@chakra-ui/react"
import React from "react"

export const NextButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      as="button"
      type="submit"
      colorScheme="primary"
      color="black"
      width="100%"
      borderRadius="100px"
      {...props}
    >
      {children || "Next"}
    </Button>
  )
}
