export type NFTResponse = {
  data: NFTResponseData
}

type NFTData = {
  token_id: string
}

type NFTResponseItem = {
  contract_address: string
  contract_name: string
  nft_data?: Array<NFTData>
}

type NFTResponseData = {
  items: Array<NFTResponseItem>
}
