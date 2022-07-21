import { EventListingObject } from "../../types/EventObject"
import { Box, Button, Image, Text, VStack } from "@chakra-ui/react"
import { ArrowRight, Calendar, MapPin } from "../Icon"
import { CURRENCIES } from "../../utils/constants"
import { Web3Connect } from "../Web3Connect"
import React, { useContext } from "react"
import { Web3Context } from "../../contexts/Web3Context"
import { ethers } from "ethers"

type EventDisplayProps = {
  event: EventListingObject
  purchaseTicket: (address: string, price: string, currency: string) => void
}

export const EventDisplay = ({ event, purchaseTicket }: EventDisplayProps) => {
  const startDate = new Date(event.startDate * 1000)
  const endDate = new Date(event.endDate * 1000)
  const { account } = useContext(Web3Context)
  return (
    <VStack alignItems="flex-start" gap={5}>
      <Box width="100%">
        <Image src={event.image} width="100%" borderRadius="16px" />
      </Box>
      <Box px={6}>
        <Box
          maxHeight="150px"
          overflowY="auto"
          borderBottom="2px solid rgba(255, 255, 255, 0.2)"
        >
          <Text fontSize="2xl" fontWeight={600}>
            {event.name}
          </Text>
          <Text>
            <Calendar bgColor="transparent" mr={1} mb={1} />
            {startDate.valueOf() !== endDate.valueOf() ? (
              <>
                {startDate.toDateString()}
                <ArrowRight height="10px" />
                {endDate.toDateString()}
              </>
            ) : (
              startDate.toDateString()
            )}
          </Text>
          <Text>
            <MapPin mr={1} mb={1} />
            {event.isOnline ? "Virtual" : "On-site"}
          </Text>
          <Text pt={5}>{event.description}</Text>
        </Box>
      </Box>
      <Box px={6}>
        <Text fontSize="2xl">
          {ethers.utils.formatEther(event.ticketPrice)}{" "}
          {CURRENCIES[event.ticketCurrency.toLowerCase()]}
        </Text>
      </Box>
      <Box width="100%" px={6} pb={4}>
        {account ? (
          <Button
            color="black"
            colorScheme="primary"
            width="100%"
            borderRadius="100px"
            onClick={() =>
              purchaseTicket(event.id, event.ticketPrice, event.ticketCurrency)
            }
          >
            Get ticket
          </Button>
        ) : (
          <Web3Connect variant="solid" width="100%" color="black" />
        )}
      </Box>
    </VStack>
  )
}
