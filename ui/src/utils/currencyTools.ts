export const priceToDecimals = (price: number): BigInt => {
  return BigInt(price * 1e18)
}

export const decimalsToPrice = (decimals: string): number => {
  const result = BigInt(decimals) * BigInt(1e-18)
  return parseInt(result.toString())
}
