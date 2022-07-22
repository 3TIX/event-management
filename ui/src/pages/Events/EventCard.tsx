import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react"
import { EventListingObject } from "../../types/EventObject"
import { ArrowRight, Calendar, MapPin, POAP } from "../../components/Icon"
import { useCallback } from "react"

export type EventCardProps = {
  event: EventListingObject
  onGetTickets: (event: EventListingObject) => void
}

export const EventCard = ({ event, onGetTickets }: EventCardProps) => {
  const startDate = new Date(parseInt(event.startDate) * 1000)
  const endDate = new Date(parseInt(event.endDate) * 1000)

  const onGetTicketsClick = useCallback(() => {
    onGetTickets(event)
  }, [event, onGetTickets])

  return (
    <Box borderRadius="16px" bgColor="modalBg" height="100%">
      <VStack alignItems="flex-start" height="100%">
        <Box width="100%">
          <Image src={event.image} width="100%" borderRadius="16px 16px 0 0" />
        </Box>
        <Spacer />
        <Container p={5}>
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
          <Text pt={5} className="clampedText">
            {event.description}
          </Text>
        </Container>
        <HStack p={5} width="100%">
          <Button
            onClick={onGetTicketsClick}
            color="black"
            colorScheme="primary"
            borderRadius="100px"
          >
            Get tickets
          </Button>
          {event.distributePoaps && (
            <>
              <Spacer />
              <POAP width="26px" height="34px" />
              <Text>Included</Text>
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  )
}
