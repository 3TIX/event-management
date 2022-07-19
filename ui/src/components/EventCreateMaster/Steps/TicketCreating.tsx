import React, { useContext, useEffect, useRef } from "react"
import { StepProps } from "../EventCreateMaster"
import { Web3Context } from "../../../contexts/Web3Context"
import { LoadingScreen } from "../../LoadingScreen"

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

  return <LoadingScreen />
}
