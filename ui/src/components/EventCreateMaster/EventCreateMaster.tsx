import React, { useCallback, useMemo, useReducer } from "react"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react"
import { MainInfo } from "./Steps/MainInfo"
import { useState } from "react"
import { StepIndicator } from "../StepIndicator/StepIndicator"
import { Description } from "./Steps/Description"
import { BackButton } from "./BackButton"
import { Parameters } from "./Steps/Parameters"
import { TicketCreating } from "./Steps/TicketCreating"
import { Done } from "./Steps/Done"
import { EventObject } from "../../types/EventObject"

export type TicketCreateMasterProps = {
  isOpen: boolean
  onClose: () => void
}

/*const initialState = {
  name: "",
  description: "",
  image: "",
  isOnline: true,
  location: "",
  startDate: Date.now(),
  endDate: Date.now(),
  organiserEmail: "",
  ticketCount: 1000,
  ticketPrice: 100,
  ticketCurrency: "0x0000000000000000000000000000000000000000",
  royaltyPercentage: 1,
  distributePoaps: true,
}*/

const initialState: EventObject = {
  name: "HackFS ticket",
  description:
    "HackFS is an ETHGlobal hackathon focused on building the foundation for that world. We've partnered with Protocol Labs - the organization building Filecoin and IPFS - to run an event centered on dapps, web3, decentralized storage, and everything in between.",
  image: "",
  symbol: "SYMB",
  isOnline: true,
  location: "https://localhost:8080",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  organiserEmail: "info@ethglobal.com",
  ticketCount: 1000,
  ticketPrice: 1.2,
  ticketCurrency: "0x2e3b96150C4D14C07781956cE4779E2a92CA1B23",
  royaltyPercentage: 1,
  distributePoaps: true,
}

type Action = { fieldName: string; value: unknown }

function reducer(state: EventObject, action: Action) {
  return { ...state, [action.fieldName]: action.value }
}

export type StepProps = {
  state: typeof initialState
  dispatch: React.Dispatch<Action>
  onNextClick: () => void
  onBackClick: () => void
}

const Steps: Array<React.ComponentType<StepProps>> = [
  MainInfo,
  Parameters,
  Description,
  TicketCreating,
  Done,
]

export const EventCreateMaster = ({
  isOpen,
  onClose,
}: TicketCreateMasterProps) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [state, dispatch] = useReducer(reducer, initialState)

  const Component = useMemo(() => {
    return Steps[stepIndex]
  }, [stepIndex])

  const onWizardClose = useCallback(() => {
    setStepIndex(0)
    onClose()
  }, [onClose])

  const onNextClick = useCallback(() => {
    if (stepIndex === Steps.length - 1) {
      onClose()
    } else {
      setStepIndex((currentIndex) => {
        return currentIndex + 1
      })
    }
  }, [onClose, stepIndex])

  const onBackClick = useCallback(() => {
    if (stepIndex === 0) {
      onClose()
    } else {
      setStepIndex((currentIndex) => {
        return currentIndex - 1
      })
    }
  }, [onClose, stepIndex])

  return (
    <Modal isOpen={isOpen} onClose={onWizardClose} isCentered>
      <ModalOverlay backdropFilter="blur(7px)" />
      <ModalContent
        bgColor="modalBg"
        borderRadius="32px"
        py={4}
        minHeight="60vh"
      >
        {stepIndex > 0 && <BackButton setStepIndex={setStepIndex} />}
        <ModalCloseButton color="primary" mr={4} fontWeight={600}>
          Cancel
        </ModalCloseButton>
        <ModalBody mt={8} mb={2} display="flex" flexDirection="column">
          <Component
            state={state}
            dispatch={dispatch}
            onNextClick={onNextClick}
            onBackClick={onBackClick}
          />
        </ModalBody>
        <StepIndicator currentStep={stepIndex} stepsAmount={Steps.length} />
      </ModalContent>
    </Modal>
  )
}
