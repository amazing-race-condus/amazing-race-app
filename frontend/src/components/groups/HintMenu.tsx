import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import QRCode from "react-qr-code"
import BottomSheetModal from "../ui/BottomSheetModal"
import { useDispatch, useSelector } from "react-redux"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { AppDispatch, RootState } from "@/store/store"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { Linking, Text, View } from "react-native"

const HintMenu = ({ ref, nextCheckpointId, easyMode }: {ref: React.RefObject<BottomSheetMethods | null>, nextCheckpointId: number, easyMode: boolean}) => {
  const dispatch: AppDispatch = useDispatch()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCheckpoints())
    }, [dispatch])
  )

  const nextCheckpoint = checkpoints.find(cp => cp.id === nextCheckpointId)

  if (!nextCheckpoint)
    return (
      <BottomSheetModal ref={ref} snapPoints={["75%"]}>
        <Text>Virhe: seuraavaa rastia ei löydetty.</Text>
      </BottomSheetModal>
    )

  const hintUrl = easyMode ? nextCheckpoint.easyHint : nextCheckpoint.hint

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["75%"]}
    >
      <Text>{easyMode ? "Helpotettu vihje:" : "Vihje:"}</Text>
      { hintUrl ?
        <View style={{ marginVertical: 5 }}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "25%", width: "100%" }}
            value={hintUrl}
            viewBox={"0 0 256 256"}
          />
          <Text onPress={ async () => await Linking.openURL(hintUrl)} style={{ textDecorationLine: "underline", marginTop: 5 }}>{hintUrl}</Text>
        </View>
        : <Text>Vihjettä seuraavalle rastille ei ole määritetty.</Text>
      }
    </BottomSheetModal>
  )
}

export default HintMenu
