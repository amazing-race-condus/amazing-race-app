import { AppDispatch } from "@/store/store"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Alert, Platform, Pressable, Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch } from "react-redux"
import { removeGroupReducer } from "@/reducers/groupSlice"
import Penalty from "./penalty"

const Team = () => {
  const { id, name } = useLocalSearchParams<{id: string, name: string}>()
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleSubmit = () => {

    const handleBack = () => {
      if (Platform.OS !== "ios") {
        router.navigate("/")
      } else {
        router.back()
      }
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän rastin?")
      if (confirmed) {
        dispatch(removeGroupReducer(id, name))
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
              dispatch(removeGroupReducer(id, name))
              handleBack()
            }
          }
        ]
      )
    }
  }

  const handleDiscqualification = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat diskaa tämän rastin?")
      if (confirmed) {
        console.log("Disqualified")
      }
    } else {
      Alert.alert(
        "Vahvista diskaus",
        "Oletko varma että haluat diskaa tämän rymän?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Poista",
            style: "destructive",
            onPress: () => {
              console.log("Disqualified")
            }
          }
        ]
      )
    }
  }

  return (
    <View style={ styles.container }>
      <View style={styles.content}>

        <Stack.Screen
          options={{ headerShown: false }}
        />

        <Stack.Screen
          options={{ headerShown: false }}
        />
        <Text style={styles.title}>{name}</Text>

        <Text style={styles.header}>Ryhmän reitti</Text>

        <Penalty/>

        <Text style={styles.header}>Poista ryhmä</Text>

        <Pressable onPress={handleSubmit} style={ styles.button }>
          <Text> Poista </Text>
        </Pressable>

        <Text style={styles.header}>Diskaa ryhmä</Text>

        <Pressable onPress={handleDiscqualification} style={ styles.button }>
          <Text> Diskaa </Text>
        </Pressable>

      </View>
    </View>
  )
}

export default Team
