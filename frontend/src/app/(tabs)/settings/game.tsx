import React, { useRef } from "react"
import { View, Text, Pressable, Alert, Platform} from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import BottomSheet from "@gorhom/bottom-sheet"

const CheckpointSettings = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const Game = () => {

    const handleStart = () => {
      if (Platform.OS === "web") {
        const confirmed = window.confirm("Oletko varma että haluat aloittaa pelin?")
        if (confirmed) {
          console.log("Sebastian Beijar")
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