import React, { useCallback, useEffect } from "react"
import { Image, Text, Textarea, VStack, Flex } from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import ReactImageUploading, { ImageListType } from "react-images-uploading"
import { StepProps } from "../TicketCreateMaster"
import { NextButton } from "../NextButton"

export const Description = ({ state, dispatch, onNextClick }: StepProps) => {
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
      <VStack spacing="40px">
        <MasterField title="Description">
          <Textarea
            name="description"
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
                  height="300px"
                  width="100%"
                  bgColor={isDragging ? "primary" : undefined}
                  alignItems="center"
                  justifyContent="center"
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <Text fontSize="xl" color={isDragging ? "black" : "primary"}>
                    {isDragging
                      ? "Drop in this area"
                      : "Click to upload or drop image here"}
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

        <NextButton />
      </VStack>
    </form>
  )
}
