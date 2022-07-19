import { EventListingObject } from "../../types/EventObject"
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Calendar, MapPin } from "../Icon"
import { CURRENCIES } from "../../utils/constants"
import { Web3Connect } from "../Web3Connect"
import React, { useContext } from "react"
import { Web3Context } from "../../contexts/Web3Context"

type EventDisplayProps = {
  event: EventListingObject
  purchaseTicket: (address: string) => void
}

export const EventDisplay = ({ event, purchaseTicket }: EventDisplayProps) => {
  const startDate = new Date(parseInt(event.startDate) * 1000)
  const endDate = new Date(parseInt(event.endDate) * 1000)
  const { account } = useContext(Web3Context)
  return (
    <VStack alignItems="flex-start">
      <AspectRatio width="100%" ratio={2 / 1.2} mb={5}>
        <Box
          bgImage={event.image}
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="contain"
        />
      </AspectRatio>
      <Container px={5}>
        <Text fontSize="2xl" fontWeight={600}>
          {event.name}
        </Text>
        <Text>
          <Calendar bgColor="transparent" mr={1} mb={1} />
          {startDate.toDateString()}
          {" > "}
          {endDate.toDateString()}
        </Text>
        <Text>
          <MapPin mr={1} mb={1} />
          {event.isOnline ? "Virtual" : "On-site"}
        </Text>
        <Text pt={5}>{event.description}</Text>
      </Container>
      <Container px={5}>
        <Text fontSize="2xl">
          {event.ticketPrice} {CURRENCIES[event.ticketCurrency]}
        </Text>
      </Container>
      <Container>
        {account ? (
          <Button
            color="black"
            colorScheme="primary"
            width="100%"
            borderRadius="100px"
            onClick={() => purchaseTicket(event.id)}
          >
            Get ticket
          </Button>
        ) : (
          <Web3Connect variant="solid" width="100%" color="black" />
        )}
      </Container>
    </VStack>
  )
}
