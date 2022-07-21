import React, { useCallback, useContext, useEffect, useState } from "react"
import {
  Image,
  Text,
  Textarea,
  VStack,
  Flex,
  useTimeout,
} from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import ReactImageUploading, { ImageListType } from "react-images-uploading"
import { StepProps } from "../EventCreateMaster"
import { NextButton } from "../NextButton"
import { ImagePlaceholder, RocketTicket } from "../../Icon"
import { Web3Connect } from "../../Web3Connect"
import { Web3Context } from "../../../contexts/Web3Context"
import { LoadingScreen } from "../../LoadingScreen"

export const Description = ({ state, dispatch, onNextClick }: StepProps) => {
  const [showImageEmpty, setShowImageEmpty] = useState(false)
  const [imageEmptyDelay, setImageEmptyDelay] = useState<number | null>(null)
  const { account, createEvent } = useContext(Web3Context)
  const [isCreatingTickets, setIsCreatingTickets] = useState(false)
  const [images, setImages] = React.useState<ImageListType>(
    state.image ? [{ dataURL: state.image }] : []
  )

  useTimeout(() => {
    setShowImageEmpty(false)
    setImageEmptyDelay(null)
  }, imageEmptyDelay)

  useEffect(() => {
    if (images.length === 1) {
      dispatch({ fieldName: "image", value: images[0].dataURL })
    }
  }, [dispatch, images])

  const onChange = useCallback((imageList: ImageListType) => {
    setImages(imageList)
  }, [])

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (!state.image) {
        setShowImageEmpty(true)
        setImageEmptyDelay(1000)
        return
      }
      setIsCreatingTickets(true)
      createEvent(state).then(() => {
        setIsCreatingTickets(false)
        onNextClick()
      })
    },
    [createEvent, onNextClick, state]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.value })
    },
    [dispatch]
  )

  return isCreatingTickets ? (
    <LoadingScreen />
  ) : (
    <form onSubmit={onSubmit}>
      <VStack spacing={4}>
        <MasterField title="Description">
          <Textarea
            isRequired
            name="description"
            height="180px"
            onChange={handleChange}
            value={state.description}
            variant="unstyled"
            resize="none"
          />
        </MasterField>
        <MasterField title="Image">
          <ReactImageUploading value={images} onChange={onChange}>
            {({ isDragging, dragProps, onImageUpload }) => {
              let imageTextColor = "white"
              if (isDragging) {
                imageTextColor = "black"
              }
              if (showImageEmpty) {
                imageTextColor = "red"
              }
              return images.length === 0 || isDragging ? (
                <Flex
                  height="180px"
                  width="100%"
                  flexDirection="column"
                  bgColor={isDragging ? "primary" : undefined}
                  alignItems="center"
                  justifyContent="center"
                  onClick={onImageUpload}
                  cursor="pointer"
                  {...dragProps}
                >
                  <ImagePlaceholder
                    width="64px"
                    height="64px"
                    opacity={0.5}
                    fill={showImageEmpty ? "red" : undefined}
                  />
                  <Text fontSize="lg" color={imageTextColor} mt={2}>
                    {isDragging ? "Drop in this area" : "Add event image"}
                  </Text>
                </Flex>
              ) : (
                <Flex
                  onClick={onImageUpload}
                  width="100%"
                  height="300px"
                  alignItems="center"
                  flexDirection="column"
                  {...dragProps}
                >
                  <Image maxHeight="300px" src={images[0].dataURL}></Image>
                </Flex>
              )
            }}
          </ReactImageUploading>
        </MasterField>
        {account ? (
          <NextButton rightIcon={<RocketTicket width="24px" height="24px" />}>
            Create tickets
          </NextButton>
        ) : (
          <Web3Connect variant="solid" width="100%" color="black" />
        )}
      </VStack>
    </form>
  )
}
