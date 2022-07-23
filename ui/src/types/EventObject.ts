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
  royaltyPercentage: string
  distributePoaps: boolean
  ticketPrice: string
  ticketCount: string
}

export type EventObject = CommonEventObject & {
  symbol?: string
}

export type EventListingObject = CommonEventObject & {
  id: string
  cid: string
  creatorAddress: string
  startDate: number
  endDate: number
}

export type EventObjectForUpload = CommonEventObject & {
  startDate: number
  endDate: number
}
