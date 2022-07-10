import React, { useCallback, useContext, useEffect, useRef } from "react"
import { Badge, Button, HStack } from "@chakra-ui/react"
import { providers } from "ethers"
import Web3Modal from "web3modal"
import { Web3Context } from "../../contexts/Web3Context"

const providerOptions = {
  /* See Provider Options Section */
}

export const Web3Connect = () => {
  const modalRef = useRef<Web3Modal>()
  const { account, setAccount, setProvider } = useContext(Web3Context)

  useEffect(() => {
    modalRef.current = new Web3Modal({
      providerOptions, // required
    })
  }, [])

  const onConnectClick = useCallback(async () => {
    if (!modalRef.current) {
      return
    }
    const instance = await modalRef.current.connect()
    const provider = new providers.Web3Provider(instance)
    setProvider(provider)
    setAccount((await provider.listAccounts())[0])

    instance.on("accountsChanged", onAccountChange)
    instance.on("disconnect", onDisconnect)
  }, [])

  const onAccountChange = useCallback((accounts: string[]) => {
    setAccount(accounts[0])
  }, [])

  const onDisconnect = useCallback(() => {
    setProvider(undefined)
    setAccount(undefined)
    if (!modalRef.current) {
      return
    }
    modalRef.current.clearCachedProvider()
  }, [])

  const onDisconnectClick = useCallback(() => {
    if (!modalRef.current) {
      return
    }
    modalRef.current.clearCachedProvider()
    setProvider(undefined)
    setAccount(undefined)
  }, [])

  return (
    <HStack>
      {account && <Badge>{account}</Badge>}
      {!account ? (
        <Button onClick={onConnectClick}>Connect</Button>
      ) : (
        <Button onClick={onDisconnectClick}>Disconnect</Button>
      )}
    </HStack>
  )
}
