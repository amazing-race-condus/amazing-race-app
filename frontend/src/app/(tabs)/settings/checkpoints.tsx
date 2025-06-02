import React, { useRef } from "react"
import { View} from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Checkpoints from "@/components/Checkpoints"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/addNewButton"
import AddCheckpointForm from "@/components/AddCheckpointForm"

const CheckpointSettings = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Checkpoints />
      <AddNewButton onPress={() => bottomSheetRef.current?.expand()} />
      <AddCheckpointForm bottomSheetRef={bottomSheetRef} />
    </View>
  )
}

export default CheckpointSettings

