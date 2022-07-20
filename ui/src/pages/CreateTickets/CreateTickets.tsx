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
} from "@chakra-ui/react"
import { QRTicket } from "./QRTicket"
import { CreateTicketsBar } from "./CreateTicketsBar"
import { TicketCreateMaster } from "../../components/TicketCreateMaster"
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const query = gql`
    query CreatedEvents {
        createdEvents {
            id
            cid
            creatorAddress
            name
            description
        }
    }
`

export const CreateTickets = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { loading, error, data } = useQuery(query)

  useEffect(() => {
    console.log("loading", loading)
    console.log("error", error)
    console.log("data", data)
  }, [loading, error, data])

  return (
    <>
      <FixedPageBackground />
      <TicketCreateMaster isOpen={isOpen} onClose={onClose} />
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
    </>
  )
}
