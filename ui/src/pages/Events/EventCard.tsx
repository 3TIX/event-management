import {
  AspectRatio,
  Box,
  Button,
  Container,
  Text,
  VStack,
} from "@chakra-ui/react"
import { EventListingObject } from "../../types/EventObject"
import { Calendar, MapPin } from "../../components/Icon"
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
    <Box borderRadius="16px" bgColor="modalBg">
      <VStack alignItems="flex-start">
        <AspectRatio width="100%" ratio={2 / 2}>
          <Box
            bgImage={event.image}
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="contain"
            borderRadius="16px"
          />
        </AspectRatio>
        <Container p={5}>
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
          <Text pt={5} className="clampedText">
            {event.description}
          </Text>
        </Container>
        <Container p={5}>
          <Button
            onClick={onGetTicketsClick}
            color="black"
            colorScheme="primary"
            borderRadius="100px"
          >
            Get tickets
          </Button>
        </Container>
      </VStack>
    </Box>
  )
}
