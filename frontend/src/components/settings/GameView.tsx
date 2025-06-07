import { setStartReducer, setEndReducer } from "@/reducers/eventSlice"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { handleAlert } from "@/utils/handleAlert"
import { View, Pressable, Text } from "react-native"
import { useDispatch } from "react-redux"

const EVENTID = 1

const GameView = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

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

  return(
    <View style={styles.content}>
      <Text style={styles.header}>Hallinnoi peliä:</Text>

      <Pressable style={styles.bigButton} onPress={() => handleStart()}>
        <Text style={styles.buttonText}>Aloita peli</Text>
      </Pressable>

      <Pressable style={styles.bigButton} onPress={() => handleEnd()}>
        <Text style={styles.buttonText}>Lopeta peli</Text>
      </Pressable>
    </View>
  )
}

export default GameView
