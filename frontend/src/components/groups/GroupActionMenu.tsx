import { Group } from "@/types"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { Pressable, Text } from "react-native"
import BottomSheetModal from "../ui/BottomSheetModal"

const GroupActionMenu = (
  { group, ref, handleDNF, handleDisqualification }:
  {
    group: Group,
    ref: React.RefObject<BottomSheetMethods | null>,
    handleDNF: () => void,
    handleDisqualification: () => void
  }
) => {
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["25%"]}
    >
      <Pressable onPress={handleDNF} style={({ pressed }) => [{
        backgroundColor: "#f54254",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
      }, {
        opacity: pressed ? 0.5 : 1
      }]}>
        <Text>
          {group?.dnf ? "Peru keskeytys" : "Keskeytä suoritus"}
        </Text>
      </Pressable>
      <Pressable onPress={handleDisqualification} style={({ pressed }) => [{
        backgroundColor: "#f54254",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
      }, {
        opacity: pressed ? 0.5 : 1
      }]}>
        <Text>
          {group?.disqualified ? "Peru diskaus" : "Diskaa ryhmä"}
        </Text>
      </Pressable>
    </ BottomSheetModal>
  )
}

export default GroupActionMenu
