import React, { useCallback, useContext, useState } from "react"
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { RenedrableToken } from "../../types/RenedrableToken"
import { MasterField } from "../MasterField"
import { BACKEND_URL } from "../../utils/constants"
import { Web3Context } from "../../contexts/Web3Context"

type ClaimModalProps = {
  isOpen: boolean
  onClose: () => void
  token: RenedrableToken | null
}

export const ClaimModal = ({ isOpen, onClose, token }: ClaimModalProps) => {
  const [email, setEmail] = useState<string>()
  const { claimQRCode } = useContext(Web3Context)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value)
    },
    []
  )

  const handleClaim = useCallback(async () => {
    if (!email || !token) {
      return
    }
    const qrCodeId = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((json) => json.id)

    claimQRCode(qrCodeId, token.tokenId, token.eventAddress).then(() =>
      onClose()
    )
  }, [claimQRCode, email, onClose, token])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(7px)" />
      <ModalContent bgColor="modalBg" borderRadius="32px">
        <ModalCloseButton />
        <ModalHeader>Claim a ticket</ModalHeader>
        <ModalBody mb={2} p={4} display="flex" flexDirection="column">
          <MasterField title="email" mb={6}>
            <Input
              type="email"
              variant="unstyled"
              value={email}
              onChange={handleChange}
            />
          </MasterField>

          <Button
            colorScheme="primary"
            color="black"
            borderRadius="100px"
            onClick={handleClaim}
          >
            Claim
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
