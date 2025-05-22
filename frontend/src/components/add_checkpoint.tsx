import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch, Provider, useSelector } from "react-redux"
import store, { AppDispatch } from "@/store/store"
import { Stack, useRouter } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from "react"
import { Checkpoint } from "@/types"
import { addCheckpoitReducer } from "@/reducers/checkpointsSlice"
import { setNotification } from "@/reducers/responseSlice"

const AddCheckpoint = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")

  const checkpointCreation = async () => {
    const newCheckpoint: Checkpoint = {
      name: name,
      id: "0"
    }
    dispatch(addCheckpoitReducer(newCheckpoint, name))
    setName("")

  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
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