import { AppDispatch, RootState } from "@/store/store"
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router"
import { FlatList, Pressable, Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { dnfGroupReducer, updateGroup, giveNextCheckpointReducer} from "@/reducers/groupSlice"
import React, { useCallback, useRef, useState } from "react"
import type { Checkpoint, Group } from "@/types"
import { disqualifyGroup } from "@/services/groupService"
import { setNotification } from "@/reducers/notificationSlice"
import Notification from "@/components/Notification"
import GroupCheckpointItem from "@/components/GroupCheckpointItem"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import QRCode from "react-qr-code"
import GroupInfoHeader from "@/components/GroupInfoHeader"
import { handleAlert } from "@/utils/handleAlert"

const Team = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const hintBottomSheetRef = useRef<BottomSheet>(null)

  const { id } = useLocalSearchParams<{id: string}>()
  const group = useSelector((state: RootState) =>
    state.groups.find(g => g.id === Number(id))
  )!

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [nextCheckpointId, setNextCheckpointId] = useState<number>(0)

  const totalPenaltyTime = group?.penalty?.reduce((total, penalty) => total + penalty.time, 0) || 0

  useFocusEffect(
    useCallback(() => {
      const checkpointsRoute = async () => {
        setCheckpoints(group.route)
        setNextCheckpointId(group.nextCheckpointId!)
      }
      checkpointsRoute()
    }, [])
  )

  const completeCheckpoint = (id: number) => {
    handleAlert({
      confirmText: "Suorita",
      title: "Vahvista suoritus",
      message: "Oletko varma että haluat merkitä rastin suoritetuksi?",
      onConfirm: () => {
        const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
        const nextId = checkpoints[currentCheckpointIndex + 1]?.id || 0
        setNextCheckpointId(nextId)
        dispatch(giveNextCheckpointReducer(group.id, nextId))
      }
    })
  }

  const handleDNF = () => {
    handleAlert({
      confirmText: "Poista",
      title: "Vahvista poisto",
      message: "Oletko varma että haluat keskeyttää ryhmän suorituksen?",
      onConfirm: () => {
        dispatch(dnfGroupReducer(Number(id)))
        bottomSheetRef.current?.close()
      }
    })
  }

  const handleDisqualification = async () => {
    handleAlert({
      confirmText: "Diskaa",
      title: "Vahvista diskaus",
      message: "Oletko varma että haluat diskata tämän ryhmän?",
      onConfirm: async () => {
        const disqualifiedGroup: Group = await disqualifyGroup(Number(id))
        const disqualified = disqualifiedGroup.disqualified
        dispatch(updateGroup(disqualifiedGroup))
        dispatch(setNotification(`Ryhmä ${disqualifiedGroup.name} ${disqualified ? "diskattu" : "epädiskattu"}`, "success"))
        bottomSheetRef.current?.close()
      }
    })
  }

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Notification />
      <Text style={[
        styles.title,
        { textDecorationLine: (group?.disqualified || group?.dnf) ? "line-through" : "none" }
      ]}>{group?.name}</Text>

      {group?.disqualified && (
        <Text style={[styles.breadText, { color: "#f54254", fontWeight: "bold" }]}>
          DISKATTU
        </Text>
      )}

      {group?.dnf && (
        <Text style={[styles.breadText, { color: "#f54254", fontWeight: "bold" }]}>
          SUORITUS KESKEYTETTY
        </Text>
      )}
      <Pressable
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          width: 50,
          height: 50,
          zIndex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => bottomSheetRef.current?.expand()}
      >
        <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
      </Pressable>
      <FlatList
        data={checkpoints}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={<GroupInfoHeader group={ group } totalPenalty={totalPenaltyTime}/>}
        renderItem={({ item }) =>
          <GroupCheckpointItem
            checkpoint = { item }
            group = { group }
            nextCheckpointId={nextCheckpointId}
            completeCheckpoint={completeCheckpoint}
            openHint = { () => hintBottomSheetRef.current?.expand() }
          />
        }
        keyExtractor={item => item.id.toString()}
      />
      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={["25%"]}
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
            backgroundColor: "#f54254",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}>
            <Text>
              {group?.dnf ? "Peru keskeytys" : "Keskeytä suoritus"}
            </Text>
          </Pressable>
          <Pressable onPress={handleDisqualification} style={{
            backgroundColor: "#f54254",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          >
            <Text>
              {group?.disqualified ? "Peru diskaus" : "Diskaa ryhmä"}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        index={-1}
        ref={hintBottomSheetRef}
        enablePanDownToClose={true}
        snapPoints={["75%"]}
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
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            viewBox={"0 0 256 256"}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export default Team
