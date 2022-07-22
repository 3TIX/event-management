import { providers } from "ethers"
import { createContext, PropsWithChildren, useCallback, useState } from "react"
import {
  ERC20__factory,
  EventManager__factory,
  EventNFT__factory,
} from "../typechain-types"
import { EventObject } from "../types/EventObject"
import { uploadJSON } from "../utils/ipfsTools"
import { utils } from "ethers"
import { EVENT_MANAGER_ADDRESS, NATIVE_CURRENCY } from "../utils/constants"
import { BuyTicket } from "../types/Functions"

type Context = {
  provider?: providers.Web3Provider
  setProvider: (provider?: providers.Web3Provider) => void
  account?: string
  setAccount: (account?: string) => void
  createEvent: (json: EventObject) => Promise<unknown>
  buyTicket: BuyTicket
}

export const Web3Context = createContext<Context>({
  provider: undefined,
  setProvider: (provider) => {},
  account: undefined,
  setAccount: (account) => {},
  createEvent: (json) => Promise.resolve(),
  buyTicket: () => Promise.resolve(),
})

export const Web3ContextProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<string>()
  const [provider, setProvider] = useState<providers.Web3Provider>()

  const createEvent = useCallback(
    async (json: EventObject) => {
      const copy: Record<string, any> = Object.assign({}, json)
      copy.startDate = String(new Date(copy.startDate).valueOf() / 1000)
      copy.endDate = String(new Date(copy.endDate).valueOf() / 1000)
      copy.ticketPrice = utils
        .parseEther(copy.ticketPrice.toString())
        .toString()
      const symbol = copy.symbol || "SYMB"
      delete copy.symbol
      const cid = await uploadJSON(copy)

      try {
        const connection = EventManager__factory.connect(
          EVENT_MANAGER_ADDRESS,
          provider?.getSigner()!
        )
        const event = await connection.createEvent(
          copy.name,
          symbol,
          `https://${cid}.ipfs.nftstorage.link`,
          copy.ticketCount,
          copy.ticketCurrency,
          copy.ticketPrice.toString(),
          { value: utils.parseEther("0.1") }
        )
        await event.wait(1)
        console.log(event)
      } catch (e) {
        console.log("Failed to create event, ", e)
        throw e
      }
    },
    [provider]
  )

  const buyTicket: BuyTicket = useCallback(
    async ({ price, currency, address }) => {
      const isNative = currency === NATIVE_CURRENCY
      if (!isNative) {
        try {
          const connection = ERC20__factory.connect(
            currency,
            provider?.getSigner()!
          )
          const allowance = await connection.allowance(
            account!,
            EVENT_MANAGER_ADDRESS
          )
          if (allowance.lt(price)) {
            const transaction = await connection.approve(
              EVENT_MANAGER_ADDRESS,
              price
            )
            await transaction.wait(1)
            console.log(transaction)
          }
        } catch (e) {
          console.log("Failed to authorise amount, ", e)
          throw e
        }
      }
      try {
        const connection = EventManager__factory.connect(
          EVENT_MANAGER_ADDRESS,
          provider?.getSigner()!
        )
        const ticketNFT = isNative
          ? await connection.buyTicket(address, { value: price })
          : await connection.buyTicket(address)
        await ticketNFT.wait(1)
        console.log(ticketNFT)
      } catch (e) {
        console.log("Failed to purchase a ticket, ", e)
        throw e
      }
    },
    [account, provider]
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
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
