import React, { useCallback, useContext, useEffect, useRef } from "react"
import { Button, HStack } from "@chakra-ui/react"
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

  const onAccountChange = useCallback(
    (accounts: string[]) => {
      setAccount(accounts[0])
    },
    [setAccount]
  )

  const onDisconnect = useCallback(() => {
    setProvider(undefined)
    setAccount(undefined)
    if (!modalRef.current) {
      return
    }
    modalRef.current.clearCachedProvider()
  }, [setAccount, setProvider])

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
  }, [onAccountChange, onDisconnect, setAccount, setProvider])

  const onDisconnectClick = useCallback(() => {
    if (!modalRef.current) {
      return
    }
    modalRef.current.clearCachedProvider()
    setProvider(undefined)
    setAccount(undefined)
  }, [setAccount, setProvider])

  return (
    <HStack>
      {!account ? (
        <Button
          variant="outline"
          color="primary"
          colorScheme="primary"
          borderRadius="100px"
          onClick={onConnectClick}
        >
          Connect wallet
        </Button>
      ) : (
        <Button
          variant="outline"
          color="primary"
          colorScheme="primary"
          borderRadius="100px"
          onClick={onDisconnectClick}
        >
          Disconnect wallet
        </Button>
      )}
    </HStack>
  )
}
