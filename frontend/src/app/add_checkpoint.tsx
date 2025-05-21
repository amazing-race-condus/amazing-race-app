import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch, Provider, useSelector } from "react-redux"
import store, { AppDispatch } from "@/store/store"
import { Stack, useRouter } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from "react"
import { Checkpoint } from "@/types"
import { addCheckpoitReducer } from "@/reducers/checkpointsSlice"
import { setNotification } from "@/reducers/responseSlice"
import AppBar from "@/components/AppBar"
import Notification from "@/components/Notification"

const AddCheckpoint = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")
  const router = useRouter()

  const checkpointCreation = async () => {
    const newCheckpoint: Checkpoint = {
      name: name,
      id: "0"
    }

    dispatch(addCheckpoitReducer(newCheckpoint))
    dispatch(setNotification(`Rasti '${name}' lisätty`))
    setName("")
    router.navigate("/checkpoints")
  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <AppBar pageTitle="Lisää rasti" />
      <Notification />
      <Text style={styles.header}>Lisää rasti:</Text>
      <Text style={styles.breadText}>Rastin nimi: </Text><TextInput
        style={styles.inputField}
        value={name}
        onChangeText={setName}
      />
      <Pressable style={styles.button} onPress={() => { checkpointCreation() }}>
        <Text style={styles.buttonText}>Lisää</Text>
      </Pressable>
    </View>
  )
}

const AddCheckpointProvider = () => (
  <Provider store={store}>
    <AddCheckpoint />
  </Provider>
)

export default AddCheckpointProvider