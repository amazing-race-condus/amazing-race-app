import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform, Dimensions} from "react-native"
import axios, { AxiosError } from "axios"
import { useSelector, useDispatch } from "react-redux"
import { RootState , AppDispatch } from "@/store/store"
import { Checkpoint, Distances } from "@/types"
import { setNotification } from "@/reducers/notificationSlice"

// Temporary style solution
import Constants from "expo-constants"
import theme from "@/theme"

const screenWidth = Dimensions.get("window").width

const CheckpointDistance = () => {
  const url =
        Platform.OS === "web"
          ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
          : process.env.EXPO_PUBLIC_BACKEND_URL
  const checkpoints: Checkpoint[] = useSelector((state: RootState) => state.checkpoints)

  const eventId = 1
  const [expandedIndex, setExpandedIndex] = useState<number>(-1)
  const [formValues, setFormValues] = useState<Distances>({})
  const dispatch = useDispatch<AppDispatch>()

  const getCheckpointDistances = async () => {
    const response = await axios.get(`${url}/settings/${eventId}/distances`)
    const distances = response.data
    if (distances) {
      setFormValues(distances)
    }
  }

  const setCheckpointDistances = async () => {
    try {
      await axios.put<Distances>(`${url}/settings/update_distances`, formValues)
      dispatch(setNotification("Rastien väliset etäisyydet päivitetty", "success"))
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Rastien välisiä etäisyyksiä ei voitu päivittää: ${error.message}`, "error"
        ))
      }
    }
  }

  useEffect(() => {
    getCheckpointDistances()
  }, [])

  const filterCriteria = (fromCheckpoint: Checkpoint) => {
    return function(toCheckpoint: Checkpoint) {
      const isSameCheckpoint = fromCheckpoint.id !== toCheckpoint.id
      const toCheckpointIsStart = toCheckpoint.type !== "START"
      const startToEnd = !(fromCheckpoint.type === "START" && toCheckpoint.type === "FINISH")
      return isSameCheckpoint && toCheckpointIsStart && startToEnd
    }
  }

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index)
  }

  const handleInputChange = (fromCheckpointId: string, toCheckpointId: string, value: string) => {

    if (isNaN(Number(fromCheckpointId)) || isNaN(Number(toCheckpointId)) || isNaN((Number(value)))) {
      return
    }

    setFormValues((prev) => ({
      ...prev,
      [Number(fromCheckpointId)]: {
        ...prev[Number(fromCheckpointId)],
        [Number(toCheckpointId)]: Number(value),
      },
    }))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rastien väliset etäisyydet:</Text>
      <View style={styles.formContainer2}>
        <Text style={styles.formText}>Matka-aika rastista...</Text>
        {checkpoints.filter(fromCheckpoint => fromCheckpoint.type !== "FINISH").map((fromCheckpoint, fromIndex) => (
          <View key={fromIndex} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleItem(fromIndex)} style={styles.itemHeader}>
              <Text style={styles.itemText}>{fromCheckpoint.name + ((fromCheckpoint.type === "START") ? " (Lähtö)" : "")}</Text>
            </TouchableOpacity>
            {expandedIndex === fromIndex && (
              <View style={styles.formContainer}>
                <Text style={styles.formText}>rastiin...</Text>
                {checkpoints.filter(filterCriteria(fromCheckpoint)).map((toCheckpoint, toIndex) => (
                  <View key={toIndex}>
                    <Text>{toCheckpoint.name + ((toCheckpoint.type === "FINISH") ? " (Maali)" : "")}</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      value={String(formValues[Number(fromCheckpoint.id)]?.[Number(toCheckpoint.id)] || "")}
                      onChangeText={(value) => handleInputChange(fromCheckpoint.id, toCheckpoint.id, value)}
                      maxLength={4}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <Pressable style={styles.button} onPress={() => { setCheckpointDistances() }}>
          <Text>Aseta</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container2: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  itemHeader: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
  },
  formContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  button: {
    height: 30,
    width: Math.min(screenWidth * 0.8, 355),
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    margin: 10,
    fontSize: theme.fontSizes.header,
    fontWeight: "bold",
    color: theme.colors.textTitle,
  },
  formContainer2: {
    backgroundColor: theme.colors.listItemBackground,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formText: {
    color: theme.colors.background,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 35,
    margin: 10,
    fontWeight: "600",
    color: theme.colors.textTitle,
    textAlign: "center",
  },
})

export default CheckpointDistance