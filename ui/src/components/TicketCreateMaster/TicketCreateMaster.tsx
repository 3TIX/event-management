import React, { useCallback } from "react"
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

export type TicketCreateMasterProps = {
  isOpen: boolean
  onClose: () => void
}

export type StepProps = {
  setStepIndex: React.Dispatch<React.SetStateAction<number>>
  stepsAmount: number
}

const Steps: Array<React.ComponentType<StepProps>> = [
  MainInfo,
  Description,
  Parameters,
]

export const TicketCreateMaster = ({
  isOpen,
  onClose,
}: TicketCreateMasterProps) => {
  const [stepIndex, setStepIndex] = useState(0)

  const Component = Steps[stepIndex]

  const onWizardClose = useCallback(() => {
    setStepIndex(0)
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={onWizardClose}>
      <ModalOverlay backdropFilter="blur(7px)" />
      <ModalContent bgColor="modalBg" borderRadius="32px" py={4}>
        {stepIndex > 0 && <BackButton setStepIndex={setStepIndex} />}
        <ModalCloseButton color="primary" mr={4} fontWeight={600}>
          Cancel
        </ModalCloseButton>
        <ModalBody mt={8} mb={2}>
          <Component setStepIndex={setStepIndex} stepsAmount={Steps.length} />
        </ModalBody>
        <StepIndicator currentStep={stepIndex} stepsAmount={Steps.length} />
      </ModalContent>
    </Modal>
  )
}
