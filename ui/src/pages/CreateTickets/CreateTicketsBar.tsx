import {
  Box,
  StackDivider,
  HStack,
  Input,
  Button,
  Flex,
  type BoxProps,
} from "@chakra-ui/react"
import { RocketTicket } from "../../components/Icon"

export const CreateTicketsBar = (props: BoxProps) => {
  return (
    <Box bgColor="primary.20" borderRadius="100px" padding={2} {...props}>
      <Flex>
        <HStack divider={<StackDivider borderColor="primary" />}>
          <Input
            color="primary"
            textAlign="center"
            variant="unstyled"
            fontWeight={600}
            placeholder="Event name"
            _placeholder={{
              color: "primary",
              fontWeight: 600,
            }}
          />
          <Input
            color="primary"
            textAlign="center"
            variant="unstyled"
            fontWeight={600}
            placeholder="Event date"
            type="date"
            _placeholder={{
              color: "primary",
              fontWeight: 600,
            }}
          />
          <Input
            color="primary"
            textAlign="center"
            variant="unstyled"
            fontWeight={600}
            placeholder="Ticket price"
            _placeholder={{
              color: "primary",
              fontWeight: 600,
            }}
          />
        </HStack>
        <Button
          colorScheme="primary"
          color="black"
          borderRadius="100px"
          mt={0}
          px={8}
          py={5}
          rightIcon={<RocketTicket />}
        >
          Create tickets
        </Button>
      </Flex>
    </Box>
  )
}
