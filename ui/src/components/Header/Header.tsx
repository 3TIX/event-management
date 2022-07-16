import { Button, Container, Flex } from "@chakra-ui/react"
import { Icon } from "../Icon"
import { Web3Connect } from "../Web3Connect"

export const Header = () => {
  return (
    <Container maxW="container.xl" w="100%" py={6}>
      <Flex justifyContent="space-between">
        <Button
          height="60px"
          variant="ghost"
          leftIcon={
            <Icon src={"assets/HeaderIcon.png"} height={60} width={60} />
          }
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
        ></Button>
        <Web3Connect />
      </Flex>
    </Container>
  )
}
