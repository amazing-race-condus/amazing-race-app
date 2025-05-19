import { View, Text, TextInput, Pressable } from "react-native"
import { Stack, useRouter } from "expo-router"
import { styles } from "@/styles/commonStyles"
import React, { useState } from 'react'
import { Checkpoint } from '@/types'
import { createCheckpoint } from '@/services/checkpointService'
import AppBar from '@/components/AppBar'

const AddCheckpoint = () => {
  const [name, setName] = useState('')
  const router = useRouter()

  const checkpointCreation = async () => {
    try {
      const newCheckpoint: Checkpoint = {
        name: name,
        id: '0'
      }
      await createCheckpoint(newCheckpoint)
      setName('')
      router.navigate(`/checkpoints`)
    } catch (error) {
      alert('Something went wrong!')
      console.error(error)
    }
  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <AppBar pageTitle="Lisää rasti" />
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

export default AddCheckpoint