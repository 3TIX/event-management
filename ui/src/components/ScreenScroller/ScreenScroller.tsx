import { Flex, Text } from "@chakra-ui/react"
import { useCallback } from "react"
import { ArrowDown } from "../Icon"

export const ScreenScroller = () => {
  const scrollScreenDown = useCallback(() => {
    window.scrollTo({ top: document.body.clientHeight, behavior: "smooth" })
  }, [])

  return (
    <Flex
      position="absolute"
      width="100%"
      bottom="0"
      alignItems="center"
      flexDirection="column"
      py={5}
      onClick={scrollScreenDown}
    >
      <Text>Explore events</Text>
      <ArrowDown />
    </Flex>
  )
}
