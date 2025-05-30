import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from "react"
import { AddCheckpoint as Todo, CheckpointType } from "@/types"
import { addCheckpoitReducer } from "@/reducers/checkpointsSlice"
import { RadioButton } from "react-native-paper"

const AddCheckpoint = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CheckpointType>("INTERMEDIATE")

  const checkpointCreation = async () => {
    // TODO: fix this type (or export) lol
    const newCheckpoint: Todo = {
      name: name,
      type: type as CheckpointType,
    }
    dispatch(addCheckpoitReducer(newCheckpoint))
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
        <RadioButton.Group onValueChange={value => setType(value as CheckpointType)} value={type}>
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
