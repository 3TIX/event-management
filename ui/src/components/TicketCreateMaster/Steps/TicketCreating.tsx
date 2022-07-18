import { Box, Spacer, VStack } from "@chakra-ui/react"
import { ClipLoader } from "react-spinners"
import React, { useContext, useEffect, useRef } from "react"
import { FunnyTexts } from "../../FunnyTexts"
import { StepProps } from "../TicketCreateMaster"
import { Web3Context } from "../../../contexts/Web3Context"

export const TicketCreating = ({ state, onNextClick }: StepProps) => {
  const firstRenderRef = useRef(true)
  const { createEvent } = useContext(Web3Context)

  useEffect(() => {
    // Hack for React 18 to prevent double effect fire
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    createEvent(state).then(() => onNextClick())
  }, [createEvent, onNextClick, state])

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
