type BuyTicketArgs = {
  address: string
  price: string
  currency: string
}

export type BuyTicket = ({
  address,
  price,
  currency,
}: BuyTicketArgs) => Promise<unknown>
