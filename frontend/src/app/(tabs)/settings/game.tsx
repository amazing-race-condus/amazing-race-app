import React, { useRef } from "react"
import { View, Text, Pressable, Alert, Platform} from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import store, { AppDispatch } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { setStartReducer, setEndReducer } from "@/reducers/eventSlice"

const CheckpointSettings = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  const Game = () => {

    const handleStart = () => {
      if (Platform.OS === "web") {
        const confirmed = window.confirm("Oletko varma että haluat aloittaa pelin?")
        if (confirmed) {
          console.log("Sebastian Beijar")
          dispatch(setStartReducer(1))
        }
      } else {
        Alert.alert(
          "Vahvista aloitus",
          "Oletko varma että haluat aloittaa pelin?",
          [
            { text: "Peru", style: "cancel" },
            {
              text: "Aloita",
              style: "destructive",
              onPress: () => {
                console.log("Sebastian Beijar")
                dispatch(setStartReducer(1))
              }
            }
          ]
        )
      }
    }

    const handleEnd = () => {
      if (Platform.OS === "web") {
        const confirmed = window.confirm("Oletko varma että haluat lopettaa pelin?")
        if (confirmed) {
          console.log("Inte Sebastian Beijar")
          dispatch(setEndReducer(1))
        }
      } else {
        Alert.alert(
          "Vahvista lopetus",
          "Oletko varma että haluat lopettaa pelin?",
          [
            { text: "Peru", style: "cancel" },
            {
              text: "Lopeta",
              style: "destructive",
              onPress: () => {
                console.log("Inte Sebastian Beijar")
                dispatch(setEndReducer(1))
              }
            }
          ]
        )
      }
    }

    return(
      <View style={styles.content}>
        <Text style={styles.header}>Hallinoi Peliä:</Text>

        <Pressable style={styles.bigButton} onPress={() => handleStart()}>
          <Text style={styles.buttonText}>Aloita peli</Text>
        </Pressable>

        <Pressable style={styles.bigButton} onPress={() => handleEnd()}>
          <Text style={styles.buttonText}>Lopeta peli</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Game/>
    </View>
  )
}

export default CheckpointSettings