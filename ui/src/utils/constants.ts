export const NATIVE_CURRENCY = "0x0000000000000000000000000000000000000000"

export const COVALENT_NFT_URL =
  "https://api.covalenthq.com/v1/80001/address/{walletAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key={token}"
export const BACKEND_URL = "http://34.136.84.119:8080/qr-code/claim"

export const COVALENT_TOKEN = "ckey_5c86efc78a4c45d5b7a46805e4b"

export const CURRENCIES: Record<string, string> = {
  [NATIVE_CURRENCY]: "MATIC",
  "0x2d7882bedcbfddce29ba99965dd3cdf7fcb10a1e": "TST",
  "0x326c977e6efc84e512bb9c30f76e30c160ed06fb": "LINK",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "WETH",
  "0x2e3b96150c4d14c07781956ce4779e2a92ca1b23": "HFS2022",
}

export const EVENT_MANAGER_ADDRESS =
  "0x4F7C4B3d3938c244ABA6e61E2a7dfAAA9E919e4C"
