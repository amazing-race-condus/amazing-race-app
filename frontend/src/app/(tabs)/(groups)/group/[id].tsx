import { AppDispatch } from "@/store/store"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Alert, Platform, Pressable, Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch } from "react-redux"
import { removeGroupReducer } from "@/reducers/groupSlice"

const Team = () => {
  const { id, name, members } = useLocalSearchParams<{id: string, name: string, members: string}>()
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleSubmit = () => {

    const handleBack = () => {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.navigate("/")
      }
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän ryhmän?")
      if (confirmed) {
        dispatch(removeGroupReducer(Number(id)))
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
              dispatch(removeGroupReducer(Number(id)))
              handleBack()
            }
          }
        ]
      )
    }
  }

  const handleDiscqualification = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat diskaa tämän ryhmän?")
      if (confirmed) {
        console.log("Disqualified")
      }
    } else {
      Alert.alert(
        "Vahvista diskaus",
        "Oletko varma että haluat diskaa tämän ryhmän?",
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
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.breadText}>Jäsenmäärä {members}</Text>
        <Text style={styles.header}>Ryhmän reitti</Text>
        <Text style={styles.breadText}>Tähän toiminnallisuutta</Text>
        <Text style={styles.header}>Ryhmän aikasakot</Text>
        <Text style={styles.breadText}>Tähän toiminnallisuutta</Text>
        <Text style={styles.header}>Sakota ryhmä</Text>
        <Text style={styles.breadText}>Tähän toiminnallisuutta</Text>
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
