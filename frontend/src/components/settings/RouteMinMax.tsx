import { View, Text, TextInput, Pressable } from "react-native"
import { Stack } from "expo-router"
import { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import store, { AppDispatch } from "@/store/store"
import { useState, useEffect } from "react"
import { RouteLimit } from "@/types"
import { setNotification } from "@/reducers/notificationSlice"
import { getLimits, setLimits } from "@/services/routeService"

const RouteMinMax = () => {
  const eventId = store.getState().event.id
  const [minimum, setMinimum] = useState("")
  const [maximum, setMaximum] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const getInitialLimits = async () => {
    const initialLimits = await getLimits(eventId)
    if (initialLimits.minRouteTime && initialLimits.maxRouteTime) {
      setMinimum(initialLimits.minRouteTime.toString())
      setMaximum(initialLimits.maxRouteTime.toString())
    }
  }

  useEffect(() => {
    getInitialLimits()
  }, [])

  const updateLimit = async (limit: RouteLimit) => {
    try {
      await setLimits(limit)
      dispatch(setNotification("Minimi- ja maksimiajat päivitetty.", "success"))
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
      id: eventId,
      minRouteTime: Number(minimum),
      maxRouteTime: Number(maximum)
    }
    updateLimit(data)
  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text style={styles.header}>Aseta reiteille aikarajat:</Text>
      <View style={styles.formContainer}>
        <Text style={styles.formText}>Reittien minimiaika:</Text>
        <TextInput
          style={styles.inputField}
          value={minimum}
          keyboardType="numeric"
          onChangeText={setMinimum}
          maxLength={4}
        />
        <Text style={styles.formText}>Reittien maksimiaika:</Text>
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
    </View>
  )
}

export default RouteMinMax