import { ERC20__factory, EventManager__factory } from "../typechain-types"
import { EVENT_MANAGER_ADDRESS, NATIVE_CURRENCY } from "../utils/constants"
import { providers, utils } from "ethers"
import { EventObject, EventObjectForUpload } from "../types/EventObject"
import { uploadJSON } from "../utils/ipfsTools"

type GetAllowanceArgs = {
  currency: string
  price: string
  account?: string
  provider?: providers.Web3Provider
}

type BuyTicketArgs = {
  eventAddress: string
  price: string
  currency: string
  provider?: providers.Web3Provider
}

type CreateEventArgs = {
  json: EventObject
  provider?: providers.Web3Provider
}

export const isNativeCurrency = (currency: string) => {
  return currency === NATIVE_CURRENCY
}

export const convertToObjectForUpload = (
  json: EventObject
): Record<string, unknown> => {
  const copy = {
    ...json,
    startDate: new Date(json.startDate).valueOf() / 1000,
    endDate: new Date(json.endDate).valueOf() / 1000,
    ticketPrice: utils.parseEther(json.ticketPrice.toString()).toString(),
  }
  delete copy.symbol
  return copy
}

export const getAllowance = async ({
  currency,
  price,
  provider,
  account,
}: GetAllowanceArgs) => {
  if (!account || !provider) {
    return null
  }
  try {
    const connection = ERC20__factory.connect(currency, provider?.getSigner()!)
    const allowance = await connection.allowance(
      account!,
      EVENT_MANAGER_ADDRESS
    )
    if (allowance.lt(price)) {
      const transaction = await connection.approve(EVENT_MANAGER_ADDRESS, price)
      await transaction.wait(1)
      console.log(transaction)
    }
  } catch (e) {
    console.log("Failed to authorise amount, ", e)
    throw e
  }
}

export const buyTicketByAddress = async ({
  eventAddress,
  price,
  currency,
  provider,
}: BuyTicketArgs) => {
  if (!provider) {
    return null
  }
  try {
    const isNative = isNativeCurrency(currency)
    const connection = EventManager__factory.connect(
      EVENT_MANAGER_ADDRESS,
      provider?.getSigner()!
    )
    const ticketNFT = isNative
      ? await connection.buyTicket(eventAddress, { value: price })
      : await connection.buyTicket(eventAddress)
    await ticketNFT.wait(1)
    console.log(ticketNFT)
  } catch (e) {
    console.log("Failed to purchase a ticket, ", e)
    throw e
  }
}

export const createEventFromJSON = async ({
  json,
  provider,
}: CreateEventArgs) => {
  if (!provider) {
    return null
  }
  const copy = convertToObjectForUpload(json) as EventObjectForUpload
  const cid = await uploadJSON(copy)
  try {
    const connection = EventManager__factory.connect(
      EVENT_MANAGER_ADDRESS,
      provider?.getSigner()!
    )
    const event = await connection.createEvent(
      copy.name,
      json.symbol!,
      `https://${cid}.ipfs.nftstorage.link`,
      copy.ticketCount,
      copy.ticketCurrency,
      copy.ticketPrice,
      copy.royaltyPercentage,
      { value: utils.parseEther("0.1") }
    )
    await event.wait(1)
    console.log(event)
  } catch (e) {
    console.log("Failed to create event, ", e)
    throw e
  }
}
