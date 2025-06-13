import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import React, { useEffect, useState } from "react"
import { BackHandler, Platform } from "react-native"

const BottomSheetModal = (
  { ref, snapPoints, isHint=false, children, onClose }:
  {
    ref: React.RefObject<BottomSheetMethods | null>
    snapPoints?: string[]
    isHint?: boolean
    children: React.ReactNode
    onClose?: () => void
  }
) => {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        if (isOpen) {
          ref.current?.close()
          return true
        }
        return false
      }

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

      return () => backHandler.remove()
    }
  }, [isOpen, ref])

  return (
    <BottomSheet
      index={-1}
      enablePanDownToClose={true}
      ref={ref}
      snapPoints={snapPoints}
      keyboardBlurBehavior="restore"
      onClose={() => {
        setIsOpen(false)
        onClose?.()
      }}
      onChange={(index) => {
        setIsOpen(index >= 0)
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={isHint ? 1 : 0.5}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        { children }
      </BottomSheetView>
    </BottomSheet>
  )
}

export default BottomSheetModal