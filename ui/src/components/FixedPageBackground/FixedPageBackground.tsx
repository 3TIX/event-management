import { Box } from "@chakra-ui/react"

export const FixedPageBackground = () => {
  return (
    <Box
      position="fixed"
      bottom="calc(-100vh - 30px)"
      right="calc(-100vh - 30px)"
      width="calc(200vh + 60px)"
      height="calc(200vh + 60px)"
      top="60px"
      opacity={0.5}
      zIndex={1}
      bgGradient="radial(bg.gradient.start 0%, bg.gradient.end 73%)"
    />
  )
}
