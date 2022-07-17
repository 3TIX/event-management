import { StepProps } from "../TicketCreateMaster"
import { Box, Spacer, VStack } from "@chakra-ui/react"
import { ClipLoader } from "react-spinners"
import React from "react"
import { FunnyTexts } from "../../FunnyTexts"

export const TicketCreating = ({ stepsAmount, setStepIndex }: StepProps) => {
  return (
    <Box position="relative">
      <Box
        position="absolute"
        top="0"
        width="100%"
        height="100%"
        bgImage="assets/TicketBg.png"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgPosition="center"
        filter="blur(7px) opacity(25%)"
      />
      <VStack spacing="40px" zIndex={1}>
        <Spacer />
        <ClipLoader
          size={150}
          color="#35CFFF"
          cssOverride={{
            borderWidth: "10px",
          }}
        />
        <Spacer />
        <FunnyTexts />
      </VStack>
    </Box>
  )
}
