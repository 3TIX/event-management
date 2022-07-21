import { Box, Button, Heading, HStack, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { ArrowRight, DiscordIcon } from "../../components/Icon"

export const QRTicket = () => {
  return (
    <Box bgImage="assets/TicketBg.png" width={347} height={547}>
      <Box bgImage="assets/QrCodeMain.png" width={227} height={227} m="60px" />
      <Box mx={8} mt={20} color="black">
        <Heading>HackFS 2022</Heading>
        <Text mt={2} color="subHeader">
          Where
        </Text>
        <Button
          variant="ghost"
          rightIcon={<ExternalLinkIcon />}
          leftIcon={<DiscordIcon />}
          p={0}
          height="auto"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
        >
          ETHGlobal Discord
        </Button>
        <Text mt={2} color="subHeader">
          When
        </Text>
        <HStack spacing={1}>
          <Text fontWeight={600}>JUL 08, 2022</Text>
          <ArrowRight color="black" height="12px" />
          <Text fontWeight={600}>JUL 29, 2022</Text>
        </HStack>
      </Box>
    </Box>
  )
}
