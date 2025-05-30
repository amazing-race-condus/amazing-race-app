import { AppDispatch, RootState } from "@/store/store"
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Alert, FlatList, Platform, Pressable, Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { removeGroupReducer, updateGroup } from "@/reducers/groupSlice"
import { getAllCheckpoints } from "@/services/checkpointService"
import React, { useCallback, useState } from "react"
import type { Checkpoint, Group } from "@/types"
import { disqualifyGroup } from "@/services/groupService"
import { setNotification } from "@/reducers/notificationSlice"
import Notification from "@/components/Notification"
import Penalty from "./penalty"
import GroupCheckpointItem from "@/components/GroupCheckpointItem"

const Team = () => {
  const { id } = useLocalSearchParams<{id: string}>()
  const group = useSelector((state: RootState) =>
    state.groups.find(g => g.id === Number(id))
  )

  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [nextCheckpointId, setNextCheckpointId] = useState<number>(0)

  useFocusEffect(
    useCallback(() => {
      const checkpointsRoute = async () => {
        const data = await getAllCheckpoints()
        const start = data.filter(a => a.type === "START")
        const finish = data.filter(a => a.type === "FINISH")
        const intermediate = data.filter(a => a.type === "INTERMEDIATE")
        intermediate.splice(4)
        const newData = [...start, ...intermediate, ...finish]
        setCheckpoints(newData)
        setNextCheckpointId(newData[0].id)
      }
      checkpointsRoute()
    }, [])
  )

  const completeCheckpoint = (id: number) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat merkitä rastin suoritetuksi?")
      if (confirmed) {
        const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
        setNextCheckpointId(checkpoints[currentCheckpointIndex + 1]?.id || 0)
      }
    } else {
      Alert.alert(
        "Vahvista suoritus",
        "Oletko varma että haluat merkitä rastin suoritetuksi?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Suorita",
            onPress: () => {
              const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
              setNextCheckpointId(checkpoints[currentCheckpointIndex + 1]?.id || 0)
            },
          }
        ]
      )
    }
  }

  const handleDelete = () => {
    const handleBack = () => {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.navigate("/")
      }
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän ryhmän?")
      if (confirmed) {
        dispatch(removeGroupReducer(Number(id)))
        handleBack()
      }
    } else {
      Alert.alert(
        "Vahvista poisto",
        "Oletko varma että haluat poistaa tämän rymän?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Poista",
            style: "destructive",
            onPress: () => {
              dispatch(removeGroupReducer(Number(id)))
              handleBack()
            }
          }
        ]
      )
    }
  }

  const handleDisqualification = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat diskata tämän ryhmän?")
      if (confirmed) {
        const disqualifiedGroup: Group = await disqualifyGroup(Number(id))
        const disqualified = disqualifiedGroup.disqualified
        dispatch(updateGroup(disqualifiedGroup))
        dispatch(setNotification(`Ryhmä ${disqualifiedGroup.name} ${disqualified ? "diskattu" : "epädiskattu"}`, "success"))
      }
    } else {
      Alert.alert(
        "Vahvista diskaus",
        "Oletko varma että haluat diskata tämän ryhmän?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Diskaa",
            style: "destructive",
            onPress: async () => {
              const disqualifiedGroup: Group = await disqualifyGroup(Number(id))
              const disqualified = disqualifiedGroup.disqualified
              dispatch(updateGroup(disqualifiedGroup))
              dispatch(setNotification(`Ryhmä ${disqualifiedGroup.name} ${disqualified ? "diskattu" : "epädiskattu"}`, "success"))
            }
          }
        ]
      )
    }
  }

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Notification />
      <Text style={styles.title}>{group?.name}</Text>
      <Text style={styles.breadText}>Diskattu: {group?.disqualified.toString()}</Text>
      <Text style={styles.breadText}>Jäsenmäärä {group?.members}</Text>
      <FlatList
        contentContainerStyle={styles.listcontainer}
        data={checkpoints}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) =>
          <GroupCheckpointItem
            checkpoint = { item }
            nextCheckpointId={nextCheckpointId}
            completeCheckpoint={completeCheckpoint}
          />
        }
        keyExtractor={item => item.id.toString()}
      />
      <Penalty id={id}/>
      <Text style={styles.header}>Poista ryhmä</Text>
      <Pressable onPress={handleDelete} style={ styles.button }>
        <Text> Poista </Text>
      </Pressable>
      <Text style={styles.header}>Diskaa ryhmä</Text>
      <Pressable onPress={handleDisqualification} style={ styles.button }>
        <Text> Diskaa / Epädiskaa </Text>
      </Pressable>

    </View>
  )
}

export default Team
