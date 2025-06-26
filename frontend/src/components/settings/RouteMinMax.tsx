import { View, Text, TextInput, Pressable } from "react-native"
import { AxiosError } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch, RootState } from "@/store/store"
import { useState, useEffect } from "react"
import { RouteLimit } from "@/types"
import { setNotification } from "@/reducers/notificationSlice"
import { setLimits } from "@/services/routeService"

const RouteMinMax = () => {
  const event = useSelector((state: RootState) => state.event)
  const [minimum, setMinimum] = useState(event.minRouteTime)
  const [maximum, setMaximum] = useState(event.maxRouteTime)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setMinimum(event.minRouteTime)
    setMaximum(event.maxRouteTime)
  }, [event.minRouteTime, event.maxRouteTime])

  const updateLimit = async (limit: RouteLimit) => {
    try {
      await setLimits(limit)
      dispatch(setNotification("Minimi- ja maksimiajat päivitetty", "success"))
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
      id: event.id,
      minRouteTime: Number(minimum),
      maxRouteTime: Number(maximum)
    }
    updateLimit(data)
  }

  return (
    <View style={styles.content}>
      <Text style={[styles.header, {fontWeight: "light", fontSize: 20}]}>Aseta reiteille aikarajat:</Text>
      <View style={styles.formContainer}>
        <Text style={styles.formText}>Reittien minimiaika:</Text>
        <TextInput
          style={styles.inputField}
          value={minimum?.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setMinimum(text ? Number(text) : null)}
          maxLength={4}
        />
        <Text style={styles.formText}>Reittien maksimiaika:</Text>
        <TextInput
          style={styles.inputField}
          value={maximum?.toString()}
          keyboardType="numeric"
          onChangeText={(text) => setMaximum(text ? Number(text) : null)}
          maxLength={4}
        />
        <Pressable style={({ pressed }) => [styles.button, {opacity: pressed ? 0.5 : 1 }]} onPress={() => { updateRouteMinMax() }}>
          <Text style={styles.buttonText}>Aseta</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default RouteMinMax