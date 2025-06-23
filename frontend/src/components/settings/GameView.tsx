import { setStartReducer, setEndReducer } from "@/reducers/eventSlice"
import { AppDispatch, RootState} from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { handleAlert } from "@/utils/handleAlert"
import { View, Pressable, Text, Dimensions, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import theme from "@/theme"
import GameReadyBox from "./GameReadyBox"

const screenWidth = Dimensions.get("window").width

const GameView = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const event = useSelector((state: RootState) => state.event)

  const handleStart = () => {
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
    <View style={styles.content}>
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <Text style={styles.title}>Hallinnoi peliä</Text>
        <Text style={[styles.title, { fontSize: 18, marginTop: 0 }]}>{event.name} </Text>
      </View>
      <GameReadyBox />
      <Pressable style={styles.bigButton} onPress={() => handleStart()}>
        <Text style={styles.buttonText}>Aloita peli</Text>
      </Pressable>

      <Pressable style={styles.bigButton} onPress={() => handleEnd()}>
        <Text style={styles.buttonText}>Lopeta peli</Text>
      </Pressable>
      {(event.startTime || event.endTime) &&
      <View style={style.container}>
        {event.startTime &&
          <Text style={{fontSize:theme.fontSizes.header, marginVertical:5}}>Peli aloitettu: {formatTime(new Date(event.startTime!))}</Text>}
        {event.endTime &&
          <Text style={{fontSize:theme.fontSizes.header, marginVertical:5}}>Peli lopetettu: {formatTime(new Date(event.endTime!))}</Text>}
      </View>}
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
