import React, { useCallback, useContext, useEffect } from "react"
import { Image, Text, Textarea, VStack, Flex } from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import ReactImageUploading, { ImageListType } from "react-images-uploading"
import { StepProps } from "../EventCreateMaster"
import { NextButton } from "../NextButton"
import { ImagePlaceholder, RocketTicket } from "../../Icon"
import { Web3Connect } from "../../Web3Connect"
import { Web3Context } from "../../../contexts/Web3Context"

export const Description = ({ state, dispatch, onNextClick }: StepProps) => {
  const { account } = useContext(Web3Context)
  const [images, setImages] = React.useState<ImageListType>(
    state.image ? [{ dataURL: state.image }] : []
  )

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
      onNextClick()
    },
    [onNextClick]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({ fieldName: event.target.name, value: event.target.value })
    },
    [dispatch]
  )
  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={4}>
        <MasterField title="Description">
          <Textarea
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
                  <ImagePlaceholder width="64px" height="64px" opacity={0.5} />
                  <Text
                    fontSize="lg"
                    color={isDragging ? "black" : "white"}
                    mt={2}
                  >
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
