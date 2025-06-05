import React, { useRef } from "react"
import { View} from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import Checkpoints from "@/components/checkpoints/Checkpoints"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/ui/addNewButton"
import AddCheckpointForm from "@/components/forms/AddCheckpointForm"

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

