import { setStartReducer, setEndReducer } from "@/reducers/eventSlice"
import { AppDispatch, RootState} from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { handleAlert } from "@/utils/handleAlert"
import { View, Pressable, Text, Dimensions, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import theme from "@/theme"

const EVENTID = 1
const screenWidth = Dimensions.get("window").width

const GameView = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const event = useSelector((state: RootState) => state.event)

  const handleStart = () => {
    handleAlert({
      confirmText: "Aloita",
      title: "Vahvista aloitus",
      message: "Oletko varma että haluat aloittaa pelin?",
      onConfirm: () => dispatch(setStartReducer(EVENTID))
    })
  }

  const handleEnd = () => {
    handleAlert({
      confirmText: "Lopeta",
      title: "Vahvista lopetus",
      message: "Oletko varma että haluat lopettaa pelin?",
      onConfirm: () => dispatch(setEndReducer(EVENTID))
    })
  }

  const formatTime = (time: Date) => {
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    return `${hours}:${minutes}`
  }

  return(
    <View style={styles.content}>
      <Text style={styles.header}>Hallinnoi peliä:</Text>

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
