import { ApolloClient, gql, InMemoryCache } from "@apollo/client"

export const EventsQuery = gql`
  query CreatedEvents {
    createdEvents {
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

export const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hackfs2022/subgraph/graphql",
  cache: new InMemoryCache(),
})
