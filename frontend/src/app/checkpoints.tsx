import React, { useEffect, useState } from 'react'
import { View, Text, Platform } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { Checkpoint } from '@/types'

const url =
  Platform.OS === 'web'
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

export const getAllCheckpoints = async (): Promise<Checkpoint[]> => {
  try {
    const response = await fetch(`${url}/checkpoints`)
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Fetch error:", error)
    alert("Tietojen haku epäonnistui.")
    return []
  }
}

const Checkpoints = () => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])

  useEffect(() => {
    const fetchCheckpoints = async () => {
      const allCheckpoints = await getAllCheckpoints()
      setCheckpoints(allCheckpoints)
    }
    fetchCheckpoints()
  }, [])

  return (
    <View style={styles.content}>
      <Stack.Screen options={{ title: `Tarkastele rasteja` }} />
      <Text>Tähän listataan rastit:</Text>
      {checkpoints.map((checkpoint, index) => (
        <Text key={index}>{checkpoint.name}</Text>
      ))}
    </View>
  )
}

export default Checkpoints