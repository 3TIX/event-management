import { useState } from "react"
import { useInterval, Text } from "@chakra-ui/react"

const Texts = [
  "Monkeys are printing tickets...",
  "Checking its cool with Vitalik...",
  "Punks are building your event page...",
  "Kitties are polishing POAPs...",
]

const INTERVAL = 5000

export const FunnyTexts = () => {
  const [currentText, setCurrentText] = useState(0)
  useInterval(() => {
    setCurrentText((current) =>
      current === Texts.length - 1 ? 0 : current + 1
    )
  }, INTERVAL)

  return (
    <Text fontSize="xl" color="white">
      {Texts[currentText]}
    </Text>
  )
}
