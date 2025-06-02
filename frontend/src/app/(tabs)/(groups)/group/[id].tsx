import { AppDispatch, RootState } from "@/store/store"
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router"
import { Alert, FlatList, Platform, Pressable, Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { dnfGroupReducer, updateGroup } from "@/reducers/groupSlice"
import { getAllCheckpoints } from "@/services/checkpointService"
import React, { useCallback, useRef, useState } from "react"
import type { Checkpoint, Group } from "@/types"
import { disqualifyGroup } from "@/services/groupService"
import { setNotification } from "@/reducers/notificationSlice"
import Notification from "@/components/Notification"
import Penalty from "./penalty"
import GroupCheckpointItem from "@/components/GroupCheckpointItem"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

const Team = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { id } = useLocalSearchParams<{id: string}>()
  const group = useSelector((state: RootState) =>
    state.groups.find(g => g.id === Number(id))
  )

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

  const handleDNF = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän ryhmän?")
      if (confirmed) {
        dispatch(dnfGroupReducer(Number(id)))
        bottomSheetRef.current?.close()
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
              dispatch(dnfGroupReducer(Number(id)))
              bottomSheetRef.current?.close()
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
      <Pressable style={{ width: 50, height: 50 }} onPress={() => bottomSheetRef.current?.expand()}>
        <FontAwesome6 name="ellipsis-vertical" size={50} color="black" />
      </Pressable>
      <Text style={styles.breadText}>Diskattu: {group?.disqualified.toString()}</Text>
      <Text style={styles.breadText}>Jäsenmäärä {group?.members}</Text>
      <Text style={styles.breadText}>dnf {group?.dnf.toString()}</Text>
      <FlatList
        data={checkpoints}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) =>
          <GroupCheckpointItem
            checkpoint = { item }
            group = { group }
            nextCheckpointId={nextCheckpointId}
            completeCheckpoint={completeCheckpoint}
          />
        }
        keyExtractor={item => item.id.toString()}
      />
      <Penalty id={id}/>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <Pressable onPress={handleDNF} style={{
            borderWidth: 1,
            backgroundColor: "#f54254",
            borderColor: "silver",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}>
            <Text> Keskeytä suoritus </Text>
          </Pressable>
          <Pressable onPress={handleDisqualification} style={{
            borderWidth: 1,
            backgroundColor: "#f54254",
            borderColor: "silver",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          >
            <Text> Diskaa / Epädiskaa ryhmä </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export default Team
