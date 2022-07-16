import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  styles: {
    global: {
      "html,body": {
        color: "white",
      },
    },
  },
  colors: {
    primary: "#35CFFF",
    "primary.20": "#35CFFF33",
    "primary.500": "#35CFFF", // Workaround for Chakra bug
    subHeader: "rgba(0, 0, 0, .59)",
    "bg.gradient.start": "#3DD1FF",
    "bg.gradient.end": "#3DD1FF00",
  },
})
