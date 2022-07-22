import {
  Box,
  Grid,
  GridItem,
  useDisclosure,
  useInterval,
} from "@chakra-ui/react"
import { EventCard } from "./EventCard"
import { useCallback, useState } from "react"
import { EventListingObject } from "../../types/EventObject"
import { EventDetailsModal } from "../../components/EventDetailsModal"
import { useQuery } from "@apollo/client"
import { CreatedEventsData, EventsQuery } from "../../graphql"

export const Events = () => {
  const [openedEvent, setOpenedEvent] = useState<EventListingObject | null>(
    null
  )
  const { data, refetch } = useQuery<CreatedEventsData>(EventsQuery)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useInterval(() => {
    refetch()
  }, 5000)

  const onGetTicketsClicked = useCallback(
    (event: EventListingObject) => {
      onOpen()
      setOpenedEvent(event)
    },
    [onOpen]
  )
  return (
    <Box width="100vw" bgColor="black">
      <Grid templateColumns="repeat(4, 1fr)" gap={9} px={40} py={10} mx={0}>
        {data &&
          data.createdEvents.map((event) => {
            return (
              <GridItem width="100%" key={event.id} zIndex={1}>
                <EventCard event={event} onGetTickets={onGetTicketsClicked} />
              </GridItem>
            )
          })}
      </Grid>
      <EventDetailsModal
        event={openedEvent}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  )
}
