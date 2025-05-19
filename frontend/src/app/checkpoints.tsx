import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, ScrollView } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { Checkpoint } from '@/types'
import { getAllCheckpoints, removeCheckpoint } from '@/services/checkpointService'

const Checkpoints = () => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])

  useEffect(() => {
    const fetchCheckpoints = async () => {
      const allCheckpoints = await getAllCheckpoints()
      setCheckpoints(allCheckpoints)
    }
    fetchCheckpoints()
  }, [])

  const handleRemoveCheckpoint = (id: string) => {
    try {
      removeCheckpoint(id).then(() => {
        setCheckpoints(checkpoints.filter(checkpoint => checkpoint.id !== id))
      })
    } catch (error) {
      alert('Something went wrong!')
      console.error(error)
    }
  }

  const CheckpointItem = ({ name, id }: { name: string, id: string }) => (
    <View style={styles.item}>
      <Text style={styles.checkpointName}>{name}</Text>
      <Pressable style={styles.button} onPress={() => { handleRemoveCheckpoint(id) }}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable>
    </View>
  )

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <ScrollView>
      <Stack.Screen options={{ title: `Tarkastele rasteja` }} />
      <Text style={styles.title}>Rastit:</Text>
      <FlatList
        contentContainerStyle={styles.listcontainer}
        data={checkpoints}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) =>
          <CheckpointItem
            name={item.name}
            id={item.id}
          />
        }
        keyExtractor={item => item.id}
      />
    </ScrollView>
  )
}

export default Checkpoints
