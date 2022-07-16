import { Box, Container } from "@chakra-ui/react"

export const FixedPageBackground = () => {
  return (
    <Container
      height="100vh"
      width="100vw"
      maxWidth="100vw"
      padding={0}
      bgColor="black"
      position="fixed"
      overflow="hidden"
      zIndex={-1}
    >
      <Box
        position="absolute"
        bottom="calc(-100vh - 30px)"
        right="calc(-100vh - 30px)"
        width="calc(200vh + 60px)"
        height="calc(200vh + 60px)"
        top="60px"
        opacity={0.5}
        bgGradient="radial(bg.gradient.start 0%, bg.gradient.end 73%)"
      ></Box>
    </Container>
  )
}
