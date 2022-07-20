type CommonEventObject = {
  name: string
  description: string
  image: string
  isOnline: boolean
  location: string
  startDate: string
  endDate: string
  organiserEmail: string
  ticketCurrency: string
  royaltyPercentage: number
  distributePoaps: boolean
}

export type EventObject = CommonEventObject & {
  symbol?: string
  ticketCount: number
  ticketPrice: number
}

export type EventListingObject = CommonEventObject & {
  id: string
  cid: string
  creatorAddress: string
  startDate: number
  endDate: number
  ticketCount: number
  ticketPrice: string
}
