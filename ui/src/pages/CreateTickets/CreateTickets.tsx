import { FixedPageBackground } from "../../components/FixedPageBackground"
import { Header } from "../../components/Header"
import {
  Flex,
  Heading,
  VStack,
  Text,
  Container,
  Spacer,
  Button,
  useDisclosure,
  Box,
} from "@chakra-ui/react"
import { QRTicket } from "./QRTicket"
import { CreateTicketsBar } from "./CreateTicketsBar"
import { EventCreateMaster } from "../../components/EventCreateMaster"
import { useQuery } from "@apollo/client"
import { EventsQuery } from "../../graphql"
import { useEffect } from "react"
import { ScreenScroller } from "../../components/ScreenScroller/ScreenScroller"
import * as React from "react"

export const CreateTickets = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data } = useQuery(EventsQuery)
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <Box width="100vw" height="100vh" bgColor="black" position="relative">
      <EventCreateMaster isOpen={isOpen} onClose={onClose} />
      <Header />
      <Container maxW="container.xl" mt={36}>
        <Flex px={40} paddingX={4}>
          <VStack align="start" flex={3}>
            <Heading size="3xl" color="white" mb={8}>
              Create on-chain tickets in seconds for any event
            </Heading>
            <Text color="white" maxWidth="70%" fontWeight={600}>
              In the Metaverse or on planet earth, 3TIX makes it easy to create,
              send and manage tickets for any kind of event.
            </Text>
            <Button variant="link">Learn more {">"}</Button>
            <Spacer flex={0.5} />
            <CreateTicketsBar onCreate={onOpen} />
          </VStack>
          <Spacer />
          <QRTicket />
        </Flex>
      </Container>
      <ScreenScroller />
    </Box>
  )
}
