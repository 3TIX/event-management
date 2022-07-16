import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  config: { useSystemColorMode: false },
  styles: {
    global: {
      "html,body": {
        color: "white",
      },
    },
  },
  colors: {
    primary: "rgb(53, 207, 255)",
    modalBg: "#0B2933",
    "primary.5": "rgba(53, 207, 255, .05)",
    "primary.20": "rgba(53, 207, 255, .5)",
    "primary.500": "rgba(53, 207, 255, 1)", // Workaround for Chakra bug
    primaryInactive: "rgba(53, 207, 255, 0.3)",
    subHeader: "rgba(0, 0, 0, .59)",
    "bg.gradient.start": "#3DD1FF",
    "bg.gradient.end": "#3DD1FF00",
  },
})
