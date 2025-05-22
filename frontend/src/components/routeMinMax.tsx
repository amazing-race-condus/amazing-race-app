import { View, Text, TextInput, Pressable, Platform } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useState } from "react"
import axios from "axios"

const RouteMinMax = () => {
  const [minimum, setMinimum]  = useState("")
  const [maximum, setMaximum]  = useState("")
  const url =
      Platform.OS === "web"
        ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
        : process.env.EXPO_PUBLIC_BACKEND_URL


    const updateRouteMinMax = () => {
      const data = {
        id: 2,
        "min_route_time": 100
      }
      const test = async (minimum: number) => {
          await axios.post<number>(`${url}/update_min`, data)
      }
    }

  return (
    <View style={{flex:1}}>
      <Text style={styles.breadText}>Reittien minimiaika:</Text>
      <TextInput 
        style={styles.inputField}
        value={minimum}
        onChangeText={setMinimum}
      />
      <Text style={styles.breadText}>Reittien maksimiaika:</Text>
      <TextInput 
        style={styles.inputField}
        value={maximum}
        onChangeText={setMaximum}
      />
      <Pressable style={styles.button} onPress={updateRouteMinMax}>
        <Text style={styles.buttonText}>Aseta</Text>
      </Pressable>
    </View>
  )
}

export default RouteMinMax