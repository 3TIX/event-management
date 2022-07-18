export type EventObject = {
  name: string
  description: string
  image: string
  symbol: string
  isOnline: boolean
  location: string
  startDate: string
  endDate: string
  organiserEmail: string
  ticketCount: number
  ticketPrice: number
  ticketCurrency: string
  royaltyPercentage: number
  distributePoaps: boolean
}

export type EventCreationObject = EventObject & {
  startDate: string
  endDate: string
}
