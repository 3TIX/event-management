import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { ArrowRight, GitHubIcon } from "../../components/Icon"

export const QRTicket = () => {
  return (
    <Box bgImage="assets/TicketBg.png" width={347} height={547}>
      <Box bgImage="assets/QrCodeMain.png" width={227} height={227} m="60px" />
      <Box mx={8} mt={20} color="black">
        <Heading>3TIX Hackathon</Heading>
        <Text mt={2} color="subHeader">
          Where
        </Text>
        <Button
          variant="ghost"
          rightIcon={<ExternalLinkIcon />}
          leftIcon={<GitHubIcon />}
          p={0}
          height="auto"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          as="a"
          target="_blank"
          href="https://github.com/3TIX/event-management"
        >
          3TIX Metaverse
        </Button>
        <Text mt={2} color="subHeader">
          When
        </Text>
        <HStack spacing={1}>
          <Text fontWeight={600}>JUL 01, 2022</Text>
          <ArrowRight color="black" height="12px" />
          <Text fontWeight={600}>JUL 31, 2022</Text>
        </HStack>
      </Box>
    </Box>
  )
}
