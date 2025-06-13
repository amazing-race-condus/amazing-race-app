import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import QRCode from "react-qr-code"
import BottomSheetModal from "../ui/BottomSheetModal"
import { useSelector } from "react-redux"
import { Linking, Text, View } from "react-native"
import { RootState } from "@/store/store"

const HintMenu = ({ ref, nextCheckpointId, easyMode }: {ref: React.RefObject<BottomSheetMethods | null>, nextCheckpointId: number, easyMode: boolean}) => {
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  const nextCheckpoint = checkpoints.find(cp => cp.id === nextCheckpointId)

  if (!nextCheckpoint)
    return (
      <BottomSheetModal ref={ref} snapPoints={["75%"]} isHint={true}>
        <Text>Virhe: seuraavaa rastia ei löydetty.</Text>
      </BottomSheetModal>
    )

  const hintUrl = easyMode ? nextCheckpoint.easyHint : nextCheckpoint.hint

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["75%"]}
      isHint={true}
    >
      <Text style={{alignSelf:"center", fontWeight:"bold"}}>{easyMode ? "Helpotettu vihje:" : "Vihje:"}</Text>
      { hintUrl ?
        <View style={{ marginVertical: 10, alignSelf:"center"}}>
          <QRCode
            size={256}
            style={{width:"100%"}}
            value={hintUrl}
            viewBox={"0 0 256 256"}
          />
          <Text onPress={ async () => await Linking.openURL(hintUrl)} style={{ textDecorationLine: "underline", marginTop: 5, alignSelf:"center" }}>{hintUrl}</Text>
        </View>
        : <Text style={{alignSelf:"center"}}>Rastille ei ole määritetty vihjettä.</Text>
      }
    </BottomSheetModal>
  )
}

export default HintMenu
