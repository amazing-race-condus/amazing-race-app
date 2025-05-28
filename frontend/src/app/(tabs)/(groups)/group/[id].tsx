import { AppDispatch, RootState } from "@/store/store"
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { Alert, FlatList, Platform, Pressable, Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { removeGroupReducer, updateGroup } from "@/reducers/groupSlice"
import { getAllCheckpoints } from "@/services/checkpointService"
import React, { useCallback, useState } from "react"
import type { Checkpoint, Group } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import { disqualifyGroup } from "@/services/groupService"
import { setNotification } from "@/reducers/responseSlice"
import Notification from "@/components/Notification"
import Penalty from "./penalty"

const Team = () => {
  const { id } = useLocalSearchParams<{id: string}>()
  const group = useSelector((state: RootState) =>
    state.groups.find(g => g.id === Number(id))
  )

  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [nextCheckpointId, setNextCheckpointId] = useState<number>(0)

  console.log(group)

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
        setNextCheckpointId(Number(newData[0].id))
      }
      checkpointsRoute()
    }, [])
  )

  const completeCheckpoint = (id: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat merkitä rastin suoritetuksi?")
      if (confirmed) {
        console.log(`Checkpoint ${id} completed`)
        const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
        setNextCheckpointId(Number(checkpoints[currentCheckpointIndex + 1]?.id || 0))

        // Database update logic can be added here
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
              console.log(`Checkpoint ${id} completed`)
              const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
              setNextCheckpointId(Number(checkpoints[currentCheckpointIndex + 1]?.id || 0))

              // Database update logic can be added here
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

  const handleDisqualification = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat diskaa tämän ryhmän?")
      if (confirmed) {
        console.log("Disqualified")
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
              console.log("Disqualified")
              const disqualifiedGroup: Group = await disqualifyGroup(Number(id))
              const disqualified = disqualifiedGroup.disqualified
              dispatch(updateGroup(disqualifiedGroup))
              dispatch(setNotification(`Ryhmä ${name} ${disqualified ? "diskattu" : "epädiskattu"}`, "success"))
            }
          }
        ]
      )
    }
  }

  const CheckpointItem = ({ name, type, id }: { name: string, type: string, id: string }) => {
    const translatedType = getType(type)
    return (
      <View style={styles.item}>
        <Text style={styles.checkpointName}>
          {name}
          {translatedType !== "" && (
            <Text style={styles.checkpointType}> {translatedType}</Text>
          )}
        </Text>

        { Number(id) === nextCheckpointId && (
          <View style={styles.content}>
            <Pressable
              onPress={() => console.log("skip")}
              style={styles.smallButton2}
            >
              <Text style={styles.buttonText}>Skip</Text>
            </Pressable>
            <Pressable
              onPress={() => completeCheckpoint(id)}
              style={styles.smallButton2}
            >
              <Text style={styles.buttonText}>Suorita</Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Vihjepuhelin")}
              style={styles.smallButton2}
            >
              <Text style={styles.buttonText}>Vihjepuhelin</Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("yliaika")}
              style={styles.smallButton2}
            >
              <Text style={styles.buttonText}>Yliaika</Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("vihje")}
              style={styles.smallButton2}
            >
              <Text style={styles.buttonText}>Vihje</Text>
            </Pressable>
          </View>
        )}

      </View>
    )
  }

  const ItemSeparator = () => <View style={styles.separator} />

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ryhmä ei löytynyt</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Notification />
      <Text style={styles.title}>{group.name}</Text>
      <Text style={styles.breadText}>Diskattu: {group.disqualified?.toString()}</Text>
      <Text style={styles.breadText}>Jäsenmäärä {group.members}</Text>
      <FlatList
        contentContainerStyle={styles.listcontainer}
        data={checkpoints}
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
