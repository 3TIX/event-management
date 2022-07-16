import { Box, Image } from "@chakra-ui/react"

type IconProps = {
  src: string
  height: number
  width: number
}

export const Icon = ({ src, height, width }: IconProps) => {
  return (
    <Box>
      <Image src={src} height={`${height}px`} width={`${width}px`} />
    </Box>
  )
}
