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

type CreateTicketsBarProps = {
  onCreate: () => void
}

export const CreateTicketsBar = ({
  onCreate,
  ...props
}: BoxProps & CreateTicketsBarProps) => {
  return (
    <Button
      onClick={onCreate}
      colorScheme="primary"
      size="lg"
      color="black"
      borderRadius="100px"
      mt={0}
      px={16}
      rightIcon={<RocketTicket />}
    >
      Create tickets
    </Button>
  )
}
