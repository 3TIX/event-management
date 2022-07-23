import { providers } from "ethers"
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react"
import { EventObject } from "../types/EventObject"
import { BuyTicket } from "../types/Functions"
import {
  buyTicketByAddress,
  createEventFromJSON,
  getAllowance,
  isNativeCurrency,
} from "./helpers"
import { EventManager__factory } from "../typechain-types"
import { EVENT_MANAGER_ADDRESS } from "../utils/constants"

type Context = {
  provider?: providers.Web3Provider
  setProvider: (provider?: providers.Web3Provider) => void
  account?: string
  setAccount: (account?: string) => void
  createEvent: (json: EventObject) => Promise<unknown>
  buyTicket: BuyTicket
  claimQRCode: (
    qrCodeId: string,
    tokenId: string,
    eventAddress: string
  ) => Promise<unknown>
}

export const Web3Context = createContext<Context>({
  provider: undefined,
  setProvider: (provider) => {},
  account: undefined,
  setAccount: (account) => {},
  createEvent: (json) => Promise.resolve(),
  buyTicket: () => Promise.resolve(),
  claimQRCode: () => Promise.resolve(),
})

export const Web3ContextProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<string>()
  const [provider, setProvider] = useState<providers.Web3Provider>()

  const createEvent = useCallback(
    async (json: EventObject) => {
      await createEventFromJSON({ json, provider })
    },
    [provider]
  )

  const buyTicket: BuyTicket = useCallback(
    async ({ price, currency, address }) => {
      const isNative = isNativeCurrency(currency)
      if (!isNative) {
        await getAllowance({ currency, price, account, provider })
      }
      await buyTicketByAddress({
        currency,
        price,
        provider,
        eventAddress: address,
      })
    },
    [account, provider]
  )

  const claimQRCode = useCallback(
    async (qrCodeId: string, tokenId: string, eventAddress: string) => {
      try {
        const connection = await EventManager__factory.connect(
          EVENT_MANAGER_ADDRESS,
          provider?.getSigner()!
        )
        const result = await connection.claimQrCode(
          eventAddress,
          tokenId,
          qrCodeId
        )
        await result.wait(1)
        console.log(result)
      } catch (e) {
        console.log("Failed to purchase a ticket, ", e)
        throw e
      }
    },
    [provider]
  )

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        setAccount,
        setProvider,
        createEvent,
        buyTicket,
        claimQRCode,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
