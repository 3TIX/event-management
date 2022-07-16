import { Box, BoxProps, Text, VStack } from "@chakra-ui/react"

export type MasterFieldProps = {
  title?: String
}

export const MasterField = ({
  children,
  title,
  ...props
}: React.PropsWithChildren<MasterFieldProps & BoxProps>) => {
  return (
    <Box
      bgColor="primary.5"
      borderRadius="4px"
      p={2}
      alignSelf="stretch"
      {...props}
    >
      <VStack alignItems="flex-start">
        {title && (
          <Text fontSize="xs" color="whiteAlpha.600">
            {title}
          </Text>
        )}
        {children}
      </VStack>
    </Box>
  )
}
