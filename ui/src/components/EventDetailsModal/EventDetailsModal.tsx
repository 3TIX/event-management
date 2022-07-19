import { EventListingObject } from "../../types/EventObject"
import {
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import React, { useCallback, useContext, useState } from "react"
import { Check } from "../Icon"
import { Web3Context } from "../../contexts/Web3Context"
import { LoadingScreen } from "../LoadingScreen"
import { EventDisplay } from "./EventDisplay"

type EventDetailsModalProps = {
  event: EventListingObject | null
  isOpen: boolean
  onClose: () => void
}

type ContentProps = {
  isPurchasing: boolean
  purchasedSuccessfully: boolean
  purchaseTicket: (address: string) => void
  event: EventListingObject
}

const Content = ({
  purchaseTicket,
  purchasedSuccessfully,
  isPurchasing,
  event,
}: ContentProps) => {
  switch (true) {
    case !isPurchasing && !purchasedSuccessfully:
      return <EventDisplay event={event} purchaseTicket={purchaseTicket} />
    case isPurchasing:
      return <LoadingScreen />
    case purchasedSuccessfully:
      return (
        <VStack spacing="40px">
          <Image src="assets/TicketFull.png" width="70%" />
          <HStack bgColor="primary.5" px={4} borderRadius="12px">
            <Text fontSize="3xl">1</Text>
            <Check />
          </HStack>
        </VStack>
      )
    default:
      return null
  }
}

export const EventDetailsModal = ({
  event,
  onClose,
  isOpen,
}: EventDetailsModalProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchasedSuccessfully, setPurchasedSuccessfully] = useState(false)
  const { buyTicket } = useContext(Web3Context)

  const onModalClose = useCallback(() => {
    setIsPurchasing(false)
    setPurchasedSuccessfully(false)
    onClose()
  }, [onClose])

  const purchaseTicket = useCallback(
    (address: string) => {
      setIsPurchasing(true)
      buyTicket(address)
        .then(() => setPurchasedSuccessfully(true))
        .finally(() => setIsPurchasing(false))
    },
    [buyTicket]
  )

  if (!event) {
    return null
  }
  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay backdropFilter="blur(7px)" />
      <ModalContent
        bgColor="modalBg"
        borderRadius="32px"
        py={4}
        minHeight="60vh"
      >
        <ModalCloseButton />
        <ModalBody mt={8} mb={2} display="flex" flexDirection="column">
          <Content
            event={event}
            purchaseTicket={purchaseTicket}
            isPurchasing={isPurchasing}
            purchasedSuccessfully={purchasedSuccessfully}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
