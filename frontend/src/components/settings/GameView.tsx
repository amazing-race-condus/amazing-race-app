import { setStartReducer, setEndReducer } from "@/reducers/eventSlice"
import { AppDispatch, RootState} from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { handleAlert } from "@/utils/handleAlert"
import { View, Pressable, Text, Dimensions, StyleSheet, ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import theme from "@/theme"
import GameReadyBox from "./GameReadyBox"
import { useEffect, useState } from "react"
import { setNotification } from "@/reducers/notificationSlice"
import { validateDistances } from "@/services/routeService"

const screenWidth = Dimensions.get("window").width

const GameView = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const event = useSelector((state: RootState) => state.event)
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const groups = useSelector((state: RootState) => state.groups)
  const [hints, setHints] = useState<boolean>(true)
  const [validDistances, setValidDistances] = useState<boolean>(false)

  const start = checkpoints.filter(c => c.type === "START")
  const finish = checkpoints.filter(c => c.type === "FINISH")
  const intermediates = checkpoints.filter(c => c.type === "INTERMEDIATE")

  const groupRoutes = groups.filter(g => g.route?.length > 0)
  const startedGroups = groups.filter(g => {
    if (!g.nextCheckpointId || !g.route) {
      return false
    }
    return g.nextCheckpointId !== g.route[0].id
  })

  useEffect(() => {
    let allHaveHints = true
    for (const checkpoint of checkpoints) {
      if (
        checkpoint.type !== "START" &&
        (!checkpoint.hint || !checkpoint.easyHint)) {
        allHaveHints = false
        setHints(allHaveHints)
      }
    }
  }, [checkpoints])

  useEffect(() => {
    const checkDistances = async () => {
      const valid = await validateDistances(event.id)
      setValidDistances(valid)
    }
    checkDistances()
  }, [event.id, checkpoints])

  const handleStart = () => {
    if (
      start.length === 0
      || finish.length === 0
      || intermediates.length < 4
      || groups.length > groupRoutes.length
      || groups.length === 0
      || !validDistances
    ) {
      const reasons = [
        start.length === 0 && "Lähtörastia ei määritetty",
        finish.length === 0 && "Maalirastia ei määritetty",
        intermediates.length < 4 && "Välirasteja on vähemmän kuin 4",
        groups.length > groupRoutes.length && "Kaikilla ryhmillä ei ole reittiä (luo reitit)",
        groups.length === 0 && "Ei ole yhtään ryhmää",
        !validDistances && "Rastien välisiä etäisyyksiä ei ole määritetty"
      ].filter(Boolean).join("\n")

      dispatch(setNotification(`Peliä ei voida aloittaa:\n${reasons}`, "error"))
      return
    }
    if (!event.startTime) {
      handleAlert({
        confirmText: "Aloita",
        title: "Vahvista aloitus",
        message: "Oletko varma että haluat aloittaa pelin?",
        onConfirm: () => dispatch(setStartReducer(event.id))
      })
    } else {
      handleAlert({
        confirmText: "Aloita",
        title: "Vahvista aloitus",
        message: "Peli on jo aloitettu. Haluatko varmasti muuttaa aloitusaikaa?",
        onConfirm: () => dispatch(setStartReducer(event.id))
      })
    }
  }

  const handleEnd = () => {
    if (!event.endTime) {
      handleAlert({
        confirmText: "Lopeta",
        title: "Vahvista lopetus",
        message: "Oletko varma että haluat lopettaa pelin?",
        onConfirm: () => dispatch(setEndReducer(event.id))
      })
    } else {
      handleAlert({
        confirmText: "Lopeta",
        title: "Vahvista lopetus",
        message: "Peli on jo lopetettu. Haluatko varmasti muuttaa pelin lopetusaikaa?",
        onConfirm: () => dispatch(setEndReducer(event.id))
      })
    }
  }

  const formatTime = (time: Date) => {
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    return `${hours}:${minutes}`
  }

  return(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.title}>Hallinnoi peliä</Text>
          <Text style={[styles.title, { fontSize: 18, marginTop: 0 }]}>{event.name} </Text>
        </View>
        <GameReadyBox
          checkpoints={checkpoints}
          groups={groups}
          start={start}
          finish={finish}
          intermediates={intermediates}
          hints={hints}
          groupRoutes={groupRoutes}
          startedGroups={startedGroups}
          validDistances={validDistances}
        />
        <Pressable style={({ pressed }) => [styles.bigButton, {opacity: pressed || event.startTime ? 0.5 : 1 }]} onPress={() => handleStart()}>
          <Text style={styles.buttonText}>Aloita peli</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.bigButton, {opacity: pressed || event.endTime ? 0.5 : 1 }]} onPress={() => handleEnd()}>
          <Text style={styles.buttonText}>Lopeta peli</Text>
        </Pressable>
        {(event.startTime || event.endTime) &&
        <View style={style.container}>
          {event.startTime &&
            <Text style={{fontSize:theme.fontSizes.header, marginVertical:5}}>Peli aloitettu: {formatTime(new Date(event.startTime!))}</Text>}
          {event.endTime &&
            <Text style={{fontSize:theme.fontSizes.header, marginVertical:5}}>Peli lopetettu: {formatTime(new Date(event.endTime!))}</Text>}
        </View>}
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: Math.min(screenWidth * 0.8, 355),
    backgroundColor: theme.colors.listItemBackground,
    padding:10,
    borderRadius:8,
    alignItems:"center"
  }
})

export default GameView
