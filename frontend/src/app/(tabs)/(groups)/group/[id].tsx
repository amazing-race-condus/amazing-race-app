import { AppDispatch, RootState } from "@/store/store"
import { Stack, useLocalSearchParams } from "expo-router"
import { FlatList, View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { dnfGroupReducer, giveNextCheckpointReducer, givePenaltyReducer, disqualifyGroupReducer} from "@/reducers/groupSlice"
import React, { useRef, useState } from "react"
import type { CompleteType } from "@/types"
import GroupCheckpointItem from "@/components/groups/GroupCheckpointItem"
import BottomSheet from "@gorhom/bottom-sheet"
import GroupInfoHeader from "@/components/groups/GroupInfoHeader"
import { handleAlert } from "@/utils/handleAlert"
import GroupOptionsMenuButton from "@/components/groups/GroupOptionsMenuButton"
import GroupStatusDisplay from "@/components/groups/GroupStatusDisplay"
import HintMenu from "@/components/groups/HintMenu"
import GroupActionMenu from "@/components/groups/GroupActionMenu"
import theme from "@/theme"

const Team = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const group = useSelector((state: RootState) =>
    state.groups.find(g => g.id === Number(id))
  )

  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const hintBottomSheetRef = useRef<BottomSheet>(null)
  const [hasFinished, setHasFinished] = useState<boolean>(Boolean(group?.finishTime))

  if (!group) {
    return null
  }

  const checkpoints = group.route || []
  const nextCheckpointId = group.nextCheckpointId!
  const totalPenaltyTime = group.penalty?.reduce((total, penalty) => total + penalty.time, 0) || 0

  const passedIds = group.route?.slice(0, group.route.findIndex(cp => cp.id === group.nextCheckpointId))
    .map(cp => cp.id)

  const completeCheckpoint = (id: number, completeType: CompleteType) => {
    if (completeType === "NORMAL") {
      handleAlert({
        confirmText: "Suorita",
        title: "Vahvista suoritus",
        message: "Oletko varma että haluat merkitä rastin suoritetuksi?",
        onConfirm: () => {
          const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
          const nextId = checkpoints[currentCheckpointIndex + 1]?.id || -1
          dispatch(giveNextCheckpointReducer(group.id, nextId))
          if (nextId === -1) {
            setHasFinished(true)
          }
        }
      })
    } else if (completeType === "SKIP") {
      handleAlert({
        confirmText: "Ohita",
        title: "Ohita rasti",
        message: "Oletko varma että haluat ohittaa rastin? Ryhmälle tulee 30 min rangaistus.",
        onConfirm: () => {
          const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
          const nextId = checkpoints[currentCheckpointIndex + 1]?.id || -1
          dispatch(giveNextCheckpointReducer(group.id, nextId))
          if (nextId === -1) {
            setHasFinished(true)
          }
          dispatch(givePenaltyReducer(group.id, id, "SKIP", 30))
        }
      })
    } else {
      handleAlert({
        confirmText: "Yliaika",
        title: "Suoritettu yliajalla",
        message: "Oletko varma että haluat merkitä rastin suoritetuksi yliajalla? Ryhmälle tulee 5 min rangaistus.",
        onConfirm: () => {
          const currentCheckpointIndex = checkpoints.findIndex(c => c.id === id)
          const nextId = checkpoints[currentCheckpointIndex + 1]?.id || -1
          dispatch(giveNextCheckpointReducer(group.id, nextId))
          if (nextId === -1) {
            setHasFinished(true)
          }
          dispatch(givePenaltyReducer(group.id, id, "OVERTIME", 5))
        }
      })
    }
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
        dispatch(disqualifyGroupReducer(Number(id)))
        bottomSheetRef.current?.close()
      }
    })
  }
  const ItemSeparator = () => <View style={styles.separator} />

  const GroupFinishView = () => {
    if (!hasFinished) return null
    const time = new Date(group.finishTime!)
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    return (
      <View style={styles.groupFinishView}>
        <Text>Ryhmä on tullut maaliin: {hours}:{minutes}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <GroupStatusDisplay group={ group } />
      {(checkpoints.length === 0) ?
        <>
          <GroupInfoHeader group={ group } totalPenalty={ totalPenaltyTime }/>
          <View style={styles.container}>
            <Text style={{color:theme.colors.textBread, fontSize:theme.fontSizes.header}}>Ryhmälle ei ole määritelty reittiä.</Text>
          </View>
        </>
        :
        <>
          <GroupOptionsMenuButton ref={ bottomSheetRef } />
          <FlatList
            data={checkpoints}
            ItemSeparatorComponent={ItemSeparator}
            ListHeaderComponent={
              <GroupInfoHeader group={ group } totalPenalty={ totalPenaltyTime }/>
            }
            ListFooterComponent={GroupFinishView}
            renderItem={({ item }) =>
              <GroupCheckpointItem
                checkpoint = { item }
                group = { group }
                nextCheckpointId={ nextCheckpointId }
                passed = { passedIds }
                completeCheckpoint={completeCheckpoint}
                openHint = { () => hintBottomSheetRef.current?.expand() }
              />
            }
            keyExtractor={item => item.id.toString()}
          />
          <GroupActionMenu
            group={group}
            ref={bottomSheetRef}
            handleDNF={handleDNF}
            handleDisqualification={handleDisqualification}
          />
          <HintMenu ref={ hintBottomSheetRef } nextCheckpointId={ nextCheckpointId } easyMode={ group.easy } />
        </>}
    </View>
  )
}

export default Team