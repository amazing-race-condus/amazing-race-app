import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from "react"
import { Checkpoint, CheckpointType } from "@/types"
import { addCheckpoitReducer } from "@/reducers/checkpointsSlice"
import { RadioButton } from "react-native-paper"

const AddCheckpoint = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")
  const [type, setType] = useState("INTERMEDIATE")

  const checkpointCreation = async () => {
    const newCheckpoint: Checkpoint = {
      name: name,
      type: type as CheckpointType,
      id: "0"
    }
    dispatch(addCheckpoitReducer(newCheckpoint, name, type))
    setName("")

  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text style={styles.header}>Lisää rasti:</Text>
      <View style={styles.formContainer}>
        <Text style={styles.formText}>Rastin nimi: </Text><TextInput
          style={styles.inputField}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.formText}>Rastin tyyppi:</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radiobuttonGroup}>
            <View style={styles.radiobuttonItem}>
              <RadioButton value="START" />
              <Text>Lähtö</Text>
            </View>
            <View style={styles.radiobuttonItem}>
              <RadioButton value="INTERMEDIATE" />
              <Text>Välirasti</Text>
            </View>
            <View style={styles.radiobuttonItem}>
              <RadioButton value="FINISH" />
              <Text>Maali</Text>
            </View>
          </View>
        </RadioButton.Group>
        <Pressable style={styles.button} onPress={() => { checkpointCreation() }}>
          <Text style={styles.buttonText}>Lisää</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default AddCheckpoint
