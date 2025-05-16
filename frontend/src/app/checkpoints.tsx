import React, { useEffect, useState } from 'react'
import { View, Text } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { Checkpoint } from '@/types'
import { getAllCheckpoints } from '@/services/checkpointService'

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
      <Text>Rastit:</Text>
      {checkpoints.map((checkpoint, index) => (
        <Text key={index}>{checkpoint.name}</Text>
      ))}
    </View>
  )
}

export default Checkpoints