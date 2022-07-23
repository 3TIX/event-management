import { Box, Button, Container, Flex, useDisclosure } from "@chakra-ui/react"
import { Icon } from "../Icon"
import { Web3Connect } from "../Web3Connect"
import { useContext } from "react"
import { Web3Context } from "../../contexts/Web3Context"
import { NFTModal } from "./NFTModal"

export const Header = () => {
  const { account } = useContext(Web3Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Container maxW="container.xl" w="100%" py={6} px={8}>
      <Flex justifyContent="space-between">
        <Icon src={"assets/HeaderIcon.png"} height={60} width={60} />
        <Box>
          {account && (
            <Button
              colorScheme="primary"
              variant="solid"
              mr={4}
              borderRadius="100px"
              color="black"
              onClick={onOpen}
            >
              My tokens
            </Button>
          )}
          <Web3Connect />
        </Box>
      </Flex>
      <NFTModal isOpen={isOpen} onClose={onClose} />
    </Container>
  )
}
