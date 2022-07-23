import { ApolloClient, gql, InMemoryCache } from "@apollo/client"
import { EventListingObject } from "../types/EventObject"

export const EventsQuery = gql`
  query CreatedEvents {
    createdEvents(orderBy: blockNumber) {
      id
      cid
      creatorAddress
      name
      description
      image
      isOnline
      location
      startDate
      endDate
      organiserEmail
      ticketCount
      ticketPrice
      ticketCurrency
      royaltyPercentage
      distributePoaps
    }
  }
`

export const EventAddressesQuery = gql`
  query CreatedEvents {
    createdEvents(orderBy: blockNumber) {
      id
    }
  }
`

export type CreatedEventsData = {
  createdEvents: Array<EventListingObject>
}

export type EventAddressesData = {
  createdEvents: Array<{ id: string }>
}

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hackfs2022/subgraph",
  cache: new InMemoryCache(),
})
