import React, { useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { Entypo } from "@expo/vector-icons"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import type { RootState, AppDispatch } from "@/store/store"
import Notification from "@/components/Notification"
import { getType, sortCheckpoints } from "@/utils/checkpointUtils"

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])

  const sortedCheckpoints = sortCheckpoints(checkpoints)

  const CheckpointItem = ({ name, type, id }: { name: string, type: string, id: string }) => {
    const translatedType = getType(type)
    return (

      <View>
        <Link href={`/checkpoints/${id}`} asChild>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.checkpointName}>
              {name}
              {translatedType !== "" && (
                <Text style={styles.checkpointType}> {translatedType}</Text>
              )}
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>
    )
  }

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Text style={styles.title}>Rastit:</Text>
        <FlatList
          contentContainerStyle={styles.listcontainer}
          data={sortedCheckpoints}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) =>
            <CheckpointItem
              name={item.name}
              type={item.type}
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
