import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import React from "react"

const BottomSheetModal = (
  { ref, snapPoints, children }:
  {
    ref: React.RefObject<BottomSheetMethods | null>
    snapPoints?: string[]
    children: React.ReactNode
  }
) => {
  return (
    <BottomSheet
      index={-1}
      enablePanDownToClose={true}
      ref={ref}
      snapPoints={snapPoints}
      keyboardBlurBehavior="restore"
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
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
