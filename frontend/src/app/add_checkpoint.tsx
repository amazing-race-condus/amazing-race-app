import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch, Provider } from 'react-redux'
import type { AppDispatch } from '@/store/store'
// eslint-disable-next-line no-duplicate-imports
import store from '@/store/store'
import { Stack, useRouter } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from 'react'
import { Checkpoint } from '@/types'
import { addCheckpoitReducer } from '@/reducers/checkpointsSlice'

const AddCheckpoint = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState('')
  const router = useRouter()

  const checkpointCreation = async () => {
    // try {
    const newCheckpoint: Checkpoint = {
      name: name,
      id: "0"
    }

    dispatch(addCheckpoitReducer(newCheckpoint))
    setName('')
    router.navigate(`/checkpoints`)
    // } catch (error) {
    //   alert('Something went wrong!')
    //   console.error(error)
    // }
  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{title: `Lisää rasti`}}
      />
      <Text style={styles.header}>Lisää rasti:</Text>
      <Text>Rastin nimi: </Text><TextInput
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