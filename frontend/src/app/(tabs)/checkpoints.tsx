import React, { useEffect } from "react"
import { View, Text, FlatList, Alert, Platform, TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { Entypo } from "@expo/vector-icons"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"
import type { RootState, AppDispatch } from "@/store/store"
import Notification from "@/components/Notification"

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])

  const handleRemoveCheckpoint = (id: string, name: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän rastin?")
      if (confirmed) {
        dispatch(removeCheckpointReducer(id, name))
      }
    } else {
      Alert.alert(
        "Vahvista poisto",
        "Oletko varma että haluat poistaa tämän rastin?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Poista",
            style: "destructive",
            onPress: () => {
              dispatch(removeCheckpointReducer(id, name))
            }
          }
        ]
      )
    }
  }

  const CheckpointItem = ({ name, id }: { name: string, id: string }) => (
    <View>
      <Link href={`/checkpoints/${id}`} asChild>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.checkpointName}>{name}</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </Link>
      {/* <Pressable style={styles.button} onPress={() => handleRemoveCheckpoint(id, name)}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable> */}
    </View>
  )

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
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
      </View>
    </View>
  )
}

export default Checkpoints
