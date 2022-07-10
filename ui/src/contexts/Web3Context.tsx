import { providers } from "ethers"
import { createContext, PropsWithChildren, useState } from "react"

type Context = {
  provider?: providers.Web3Provider
  setProvider: (provider?: providers.Web3Provider) => void
  account?: string
  setAccount: (account?: string) => void
}

export const Web3Context = createContext<Context>({
  provider: undefined,
  setProvider: (provider) => {},
  account: undefined,
  setAccount: (account) => {},
})

export const Web3ContextProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<string>()
  const [provider, setProvider] = useState<providers.Web3Provider>()

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        setAccount,
        setProvider,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
