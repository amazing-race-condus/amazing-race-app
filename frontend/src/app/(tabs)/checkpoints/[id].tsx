import { View, Text, Dimensions } from "react-native"
import { useRef } from "react"
import { useLocalSearchParams, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import ArrivingGroups from "@/components/checkpoints/ArrivingGroups"
import HintMenu from "@/components/groups/HintMenu"
import { getType } from "@/utils/checkpointUtils"
import BottomSheet from "@gorhom/bottom-sheet"
import ActionButton from "@/components/ui/ActionButton"

const Checkpoint = () => {
  const screenWidth = Dimensions.get("window").width
  const hintBottomSheetRef = useRef<BottomSheet>(null)
  const easyHintBottomSheetRef = useRef<BottomSheet>(null)
  const { id } = useLocalSearchParams()
  const checkpoint = useSelector((state: RootState) =>
    state.checkpoints.find(g => g.id === Number(id))
  )

  const translatedType = checkpoint?.type ? getType(checkpoint.type) : "välirasti"
  return (
    <View style={styles.container}>
      <View style={[styles.content, { flex: 1 }]}>
        <Stack.Screen
          options={{ headerShown: false }}
        />
        <Text style={styles.title}>{checkpoint?.name}</Text>
        <Text style={[styles.breadText, {fontWeight: "bold"}]}>
          { translatedType }
        </Text>
        {(checkpoint?.type !== "START") && (
          <View style={{flexDirection:"row", marginBottom:0, marginTop: 20, width: Math.min(screenWidth * 0.9, 355)}}>
            <ActionButton
              style={[styles.button, {marginHorizontal:15, flex:1}]}
              onPress={() => hintBottomSheetRef.current?.expand()}
              text={"Vihje"}
            />
            <ActionButton
              style={[styles.button, {marginHorizontal:15, flex:1}]}
              onPress={() => easyHintBottomSheetRef.current?.expand()}
              text={"Helpotettu vihje"}
            />
          </View>)}
        <ArrivingGroups checkpointId={Number(id)} />
      </View>
      <HintMenu ref={hintBottomSheetRef} nextCheckpointId={Number(id)} easyMode={ false }/>
      <HintMenu ref={easyHintBottomSheetRef} nextCheckpointId={Number(id)} easyMode={ true }/>
    </View>
  )
}

export default Checkpoint
