import { COVALENT_NFT_URL, COVALENT_TOKEN } from "../utils/constants"

export const NFT_TOKENS_QUERY = "nftTockens"

export const fetchTokens = async (id: string, account: string) => {
  if (!account) {
    return Promise.reject()
  }
  const url = COVALENT_NFT_URL.replace("{walletAddress}", account).replace(
    "{token}",
    COVALENT_TOKEN
  )
  return fetch(url).then((res) => res.json())
}
