import React, { useRef, useState, useEffect } from "react"
import { View} from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Checkpoints from "@/components/checkpoints/Checkpoints"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/ui/addNewButton"
import AddCheckpointForm from "@/components/forms/AddCheckpointForm"
import { Checkpoint } from "@/types"
import EditCheckpointForm from "@/components/forms/EditCheckpointForm"

const CheckpointSettings = () => {
  const addBottomSheetRef = useRef<BottomSheet>(null)
  const editBottomSheetRef = useRef<BottomSheet>(null)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | undefined>(undefined)

  const handleEdit = (checkpoint: Checkpoint) => {
    setSelectedCheckpoint(checkpoint)
  }

  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
    setSelectedCheckpoint(undefined)
  }

  useEffect(() => {
    if (selectedCheckpoint && editBottomSheetRef.current) {
      editBottomSheetRef.current.expand()
    }
  }, [selectedCheckpoint])

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Checkpoints onEditCheckpoint={handleEdit}/>
      <AddNewButton onPress={handleAdd} />
      <AddCheckpointForm bottomSheetRef={addBottomSheetRef} />
      <EditCheckpointForm
        bottomSheetRef={editBottomSheetRef}
        checkpoint={selectedCheckpoint}
        setSelectedCheckpoint={setSelectedCheckpoint}
      />
    </View>
  )
}

export default CheckpointSettings

