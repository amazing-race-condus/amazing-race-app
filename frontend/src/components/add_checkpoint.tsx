import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch, Provider, useSelector } from "react-redux"
import store, { AppDispatch } from "@/store/store"
import { Stack, useRouter } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from "react"
import { Checkpoint } from "@/types"
import { addCheckpoitReducer } from "@/reducers/checkpointsSlice"
import { setNotification } from "@/reducers/responseSlice"
import { RadioButton } from "react-native-paper"

const AddCheckpoint = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")
  const [type, setType] = useState("INTERMEDIATE")

  const checkpointCreation = async () => {
    const newCheckpoint: Checkpoint = {
      name: name,
      type: type,
      id: "0"
    }
    console.log("n1, newCheckpoint", newCheckpoint)
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
      <Text style={[styles.breadText, { marginTop: 16 }]}>Rastin tyyppi:</Text>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="START" />
            <Text>Lähtö</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="INTERMEDIATE" />
            <Text>Välirasti</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="FINISH" />
            <Text>Maali</Text>
          </View>
        </View>
      </RadioButton.Group>
      <br />
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