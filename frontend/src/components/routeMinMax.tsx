import { View, Text, TextInput, Pressable, Platform } from "react-native"
import axios, { AxiosError } from "axios"
import { useDispatch, Provider } from "react-redux"
import { styles } from "@/styles/commonStyles"
import store, { AppDispatch } from "@/store/store"
import { useState } from "react"
import { RouteLimit } from "@/types"
import { setNotification } from "@/reducers/responseSlice"

const RouteMinMax = () => {
  const [minimum, setMinimum] = useState("")
  const [maximum, setMaximum] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const url =
      Platform.OS === "web"
        ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
        : process.env.EXPO_PUBLIC_BACKEND_URL

  
  const updateLimit = async (limit: RouteLimit) => {
    try {
      const response = await axios.put<RouteLimit>(`${url}/settings/update_limits`, limit)
      return response
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Reittien minimi- ja maksimiaikoja ei voitu muuttaa: ${error.message}`, "error"
        ))
      }
    }
  }
  const updateRouteMinMax = () => {
    const data = {
      "id": 1,
      "min_route_time": Number(minimum),
      "max_route_time": Number(maximum)
    }
    updateLimit(data)
  }

  return (
    <View style={{flex:1}}>
      <Text style={styles.breadText}>Reittien minimiaika:</Text>
      <TextInput 
        style={styles.inputField}
        value={minimum}
        keyboardType="numeric"
        onChangeText={setMinimum}
        maxLength={4}
      />
      <Text style={styles.breadText}>Reittien maksimiaika:</Text>
      <TextInput 
        style={styles.inputField}
        value={maximum}
        keyboardType="numeric"
        onChangeText={setMaximum}
        maxLength={4}
      />
      <Pressable style={styles.button} onPress={() => { updateRouteMinMax() }}>
        <Text style={styles.buttonText}>Aseta</Text>
      </Pressable>
    </View>
  )
}

const RouteMinMaxProvider = () => (
  <Provider store={store}>
    <RouteMinMax />
  </Provider>
)

export default RouteMinMaxProvider