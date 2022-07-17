import React, { useCallback } from "react"
import { Image, Text, Textarea, VStack, Flex, Button } from "@chakra-ui/react"
import { MasterField } from "../../MasterField"
import ReactImageUploading, { ImageListType } from "react-images-uploading"
import { StepProps } from "../TicketCreateMaster"
import { NextButton } from "../NextButton"

export const Description = ({ setStepIndex, stepsAmount }: StepProps) => {
  const [images, setImages] = React.useState<ImageListType>([])
  const onChange = useCallback(
    (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
      setImages(imageList)
    },
    []
  )
  console.log(images)
  return (
    <VStack spacing="40px">
      <MasterField title="Description">
        <Textarea variant="unstyled" resize="none" />
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
              <Image
                src={images[0].dataURL}
                onClick={onImageUpload}
                {...dragProps}
              ></Image>
            )
          }}
        </ReactImageUploading>
      </MasterField>

      <NextButton stepsAmount={stepsAmount} setStepIndex={setStepIndex} />
    </VStack>
  )
}
