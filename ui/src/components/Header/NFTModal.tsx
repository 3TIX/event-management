import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import useSWR from "swr"
import React, { useCallback, useContext, useMemo, useState } from "react"
import { fetchTokens, NFT_TOKENS_QUERY } from "../../fetchers/nftTokens"
import { Web3Context } from "../../contexts/Web3Context"
import { ClipLoader } from "react-spinners"
import { NFTResponse } from "../../types/NFTResponse"
import { useQuery } from "@apollo/client"
import { EventAddressesData, EventAddressesQuery } from "../../graphql"
import { RenedrableToken } from "../../types/RenedrableToken"
import { ClaimModal } from "./ClaimModal"

type NFTModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const NFTModal = ({ isOpen, onClose }: NFTModalProps) => {
  const {
    isOpen: isOpenClaimModal,
    onOpen: onOpenClaimModal,
    onClose: onCloseClaimModal,
  } = useDisclosure()
  const { account } = useContext(Web3Context)
  const { data: nftData } = useSWR<NFTResponse>(
    [NFT_TOKENS_QUERY, account],
    fetchTokens,
    { refreshInterval: 5000 }
  )
  const [claimedNFT, setClaimedNFT] = useState<RenedrableToken | null>(null)
  const onClaimClick = useCallback(
    (token: RenedrableToken) => {
      setClaimedNFT(token)
      onOpenClaimModal()
    },
    [onOpenClaimModal]
  )
  const { data: eventsData } = useQuery<EventAddressesData>(EventAddressesQuery)
  const tokens = useMemo<Array<RenedrableToken> | null>(() => {
    if (!eventsData || !nftData) {
      return null
    }
    const tokens: Array<RenedrableToken> = []
    eventsData.createdEvents.forEach((event) => {
      nftData.data.items.forEach((nftItem) => {
        nftItem.nft_data?.forEach((nftData) => {
          if (nftItem.contract_address === event.id) {
            tokens.push({
              tokenId: nftData.token_id,
              eventAddress: event.id,
              contractName: nftItem.contract_name,
            })
          }
        })
      })
    })
    return tokens
  }, [nftData, eventsData])
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(7px)" />
        <ModalContent bgColor="modalBg" borderRadius="32px" minHeight="60vh">
          <ModalCloseButton />
          <ModalHeader>My Tokens</ModalHeader>
          <ModalBody mb={2} p={0} display="flex" flexDirection="column">
            {!tokens ? (
              <Flex alignItems="center" justifyContent="center" flex={1}>
                <ClipLoader
                  size={150}
                  color="#35CFFF"
                  cssOverride={{
                    borderWidth: "10px",
                  }}
                />
              </Flex>
            ) : (
              <TableContainer>
                <Table variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th>Event name</Th>
                      <Th>Token Id</Th>
                      <Th>Claim ticket</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tokens.map((token) => {
                      return (
                        <Tr key={token.tokenId}>
                          <Td
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxWidth={0}
                            title={token.contractName}
                          >
                            {token.contractName}
                          </Td>
                          <Td>{token.tokenId}</Td>
                          <Td>
                            <Button
                              colorScheme="primary"
                              color="black"
                              borderRadius="100px"
                              onClick={() => onClaimClick(token)}
                            >
                              Claim
                            </Button>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <ClaimModal
        onClose={onCloseClaimModal}
        isOpen={isOpenClaimModal}
        token={claimedNFT}
      />
    </>
  )
}
