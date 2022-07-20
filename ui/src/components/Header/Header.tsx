import { Button, Container, Flex } from "@chakra-ui/react"
import { Icon } from "../Icon"
import { Web3Connect } from "../Web3Connect"

export const Header = () => {
  return (
    <Container maxW="container.xl" w="100%" py={6} px={8}>
      <Flex justifyContent="space-between">
        <Icon src={"assets/HeaderIcon.png"} height={60} width={60} />
        <Web3Connect />
      </Flex>
    </Container>
  )
}
