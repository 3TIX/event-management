import { providers } from "ethers"
import { createContext, PropsWithChildren, useCallback, useState } from "react"
import { EventManager__factory } from "../typechain-types"
import { EventObject } from "../types/EventObject"
import { uploadJSON } from "../utils/ipfsTools"
import { ethers } from "ethers"
import { ADDRESS } from "../utils/constants"

type Context = {
  provider?: providers.Web3Provider
  setProvider: (provider?: providers.Web3Provider) => void
  account?: string
  setAccount: (account?: string) => void
  createEvent: (json: EventObject) => Promise<unknown>
  buyTicket: (address: string) => Promise<unknown>
}

export const Web3Context = createContext<Context>({
  provider: undefined,
  setProvider: (provider) => {},
  account: undefined,
  setAccount: (account) => {},
  createEvent: (json) => Promise.resolve(),
  buyTicket: (address) => Promise.resolve(),
})

export const Web3ContextProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<string>()
  const [provider, setProvider] = useState<providers.Web3Provider>()

  const createEvent = useCallback(
    async (json: EventObject) => {
      const copy = Object.assign({}, json)
      copy.startDate = String(new Date(copy.startDate).valueOf() / 1000)
      copy.endDate = String(new Date(copy.endDate).valueOf() / 1000)
      const cid = await uploadJSON(copy)

      try {
        const connection = EventManager__factory.connect(
          ADDRESS,
          provider?.getSigner()!
        )
        const event = await connection.createEvent(
          copy.name,
          copy.symbol,
          `https://${cid}.ipfs.nftstorage.link`,
          copy.ticketCount,
          copy.ticketCurrency,
          copy.ticketPrice,
          { value: ethers.utils.parseEther("0.1") }
        )
        console.log(event)
      } catch (e) {
        console.log("Failed to create event, ", e)
        throw e
      }
    },
    [provider]
  )

  const buyTicket = useCallback(
    async (address: string) => {
      try {
        const connection = EventManager__factory.connect(
          ADDRESS,
          provider?.getSigner()!
        )
        const ticketNFT = await connection.buyTicket(address)
        console.log(ticketNFT)
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
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
