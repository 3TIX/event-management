import { Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react"
import { EventCard } from "./EventCard"
import { useCallback, useState } from "react"
import { EventListingObject } from "../../types/EventObject"
import { EventDetailsModal } from "../../components/EventDetailsModal/EventDetailsModal"

const queryResult = {
  data: {
    createdEvents: [
      {
        id: "0x40d35f91b3decbe76c5995e73c4cb95ad96b0ded",
        cid: "bafkreihhb56l7rt7krdxqcdurv2xf7zqpjcluhf4wbkneypk5pjdre2h6m",
        creatorAddress: "0xd75760b5c611d76c710c30511a9c64c9dd71a8b0",
        name: "HackFS ticket",
        description:
          "HackFS is an ETHGlobal hackathon focused on building the foundation for that world. We've partnered with Protocol Labs - the organization building Filecoin and IPFS - to run an event centered on dapps, web3, decentralized storage, and everything in between.",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQAAAADcA+lXAAACl0lEQVR4Xu3aPZKcMBCGYW1tMOEcYY7C0eBoHIUjOCTYcu98rW4Ba2B/7Mi8X+CSNK3HURdCbLG/TPm48N0AACgAAAoAgAIAoAAAKAAACgCAAgCg/DtgKi2vWr9p8Ved2Kzluw1LzT33AQAoABsgR8OrtJuNKuzfnv9o9bcA12ISAQBQALbArB1RpuGL1t/KQ93YaVzpUjoAAIAvApN344sebREAAIAfAeYNqDKfVCNpAACAz4CIlwnQS9e3zokRAADlykBLArFnNVlqAAAUgD1gJwtwkrMfAQCUywFTa7PsuWcDLuniOffQrfvodxsAAADHQKcGrOu3/KFmdFqtqV9aGYACAKCsgfhlEPWc1D0a26xutLhot8NuBAAAMAc23Vjqh6o8J466aO9VVictAABemAOATHTjw0+DQjKdnxN9h+fPR1sNAIBybcDbzPSe1fskbgAzi1bLAAAAatke8GxAU88V/9Abk94/VIWWL127jzYAAAXAh7lHmvZoOhQBtmpAAIAoAzgAJm8zlRfvOX8DW8VfuvwGI+gIAIACsAHamp5m2XND/AlSTqb4f/bOiTkCMADlysBce65EmfkbmJ8TNznuRgAAAEtA6TUpfgNo629TeYL064yjbgQAAHCg02godY93Y2ZzaPSyCACAArACNpnaOTEzRgP6L9auMwAUAABl1Y0tOifaujXr8id36wAACoCAHA2bSwsB0qIBa9l+N+YIAEC5NDCvey4TDWgfDo0AAADla4Am3o3emt6Nfjf40HRUWQQAQAE4ASKD1pTQprNzIgAAgDkQqWWee9yt5zkxvloBAACcAi3ejbFnyEXfk1puMgAFAEBpwE8DAKAAACgAAAoAgAIAoAAAKAAACgCA8h8A70ChBGmhqT4cAAAAAElFTkSuQmCC",
        isOnline: true,
        location: "https://localhost:8080",
        startDate: "1657296000",
        endDate: "1659088800",
        organiserEmail: "info@ethglobal.com",
        ticketCount: "1000",
        ticketPrice: "1500000000000000000",
        ticketCurrency: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        royaltyPercentage: 1,
        distributePoaps: true,
      },
      {
        id: "0x61de8306f44c7b148595b661854712d9aff5b991",
        cid: "bafkreihskuaorlc4fwweu5jkiy7feixbambg4vomgeb5padqqve2e25o4a",
        creatorAddress: "0xd75760b5c611d76c710c30511a9c64c9dd71a8b0",
        name: "HackFS ticket",
        description:
          "HackFS is an ETHGlobal hackathon focused on building the foundation for that world. We've partnered with Protocol Labs - the organization building Filecoin and IPFS - to run an event centered on dapps, web3, decentralized storage, and everything in between.",
        image:
          "https://bafkreicq4rmporfrxq35c2l4kwhzar527olkiraf4e5rlts64r4kz3akpm.ipfs.nftstorage.link",
        isOnline: true,
        location: "https://localhost:8080",
        startDate: "1657296000",
        endDate: "1659088800",
        organiserEmail: "info@ethglobal.com",
        ticketCount: "1000",
        ticketPrice: "1500000000000000000",
        ticketCurrency: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        royaltyPercentage: 1,
        distributePoaps: true,
      },
    ],
  },
}

export const Events = () => {
  const [openedEvent, setOpenedEvent] = useState<EventListingObject | null>(
    null
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const onGetTicketsClicked = useCallback(
    (event: EventListingObject) => {
      onOpen()
      setOpenedEvent(event)
    },
    [onOpen]
  )
  return (
    <Box width="100vw" height="100vh" bgColor="black">
      <Grid templateColumns="repeat(4, 1fr)" gap={9} px={40} py={10} mx={0}>
        {queryResult.data.createdEvents.map((event) => {
          return (
            <GridItem width="100%" key={event.id}>
              <EventCard event={event} onGetTickets={onGetTicketsClicked} />
            </GridItem>
          )
        })}
      </Grid>
      <EventDetailsModal
        event={openedEvent}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  )
}
