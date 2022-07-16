import React from "react"
import { Button } from "@chakra-ui/react"

type BackButtonProps = {
  setStepIndex: React.Dispatch<React.SetStateAction<number>>
}

export const BackButton = ({ setStepIndex }: BackButtonProps) => {
  return (
    <Button
      variant="ghost"
      fontSize="xs"
      color="primary"
      size="sm"
      position="absolute"
      top={2}
      left={3}
      _hover={{
        bgColor: "trasnparent",
      }}
      _active={{
        bgColor: "trasnparent",
      }}
      onClick={() => setStepIndex((currentIndex) => currentIndex - 1)}
    >
      {"<"} Back
    </Button>
  )
}
