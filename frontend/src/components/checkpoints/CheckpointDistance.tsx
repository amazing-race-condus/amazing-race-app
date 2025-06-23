import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native"
import { AxiosError } from "axios"
import { useSelector, useDispatch } from "react-redux"
import store, { RootState , AppDispatch } from "@/store/store"
import { Checkpoint, Distances } from "@/types"
import { styles } from "@/styles/commonStyles"
import { setNotification } from "@/reducers/notificationSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { getDistances, setDistances } from "@/services/routeService"

const CheckpointDistance = () => {
  const checkpoints: Checkpoint[] = useSelector((state: RootState) => state.checkpoints)
  const eventId = store.getState().event.id

  const [expandedIndex, setExpandedIndex] = useState<number>(-1)
  const [formValues, setFormValues] = useState<Distances>({})
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchCheckpoints(eventId))
  }, [dispatch, eventId])

  const getCheckpointDistances = async () => {
    const distances = await getDistances(eventId)
    if (distances) {
      setFormValues(distances)
    }
  }

  const setCheckpointDistances = async () => {
    try {
      await setDistances(formValues, eventId)
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
    <View style={styles.container2}>
      <Text style={[styles.header, {fontWeight: "light"}]}>Rastien väliset etäisyydet:</Text>
      <View style={styles.formContainer}>
        <Text style={styles.formText2}>Matka-aika rastista...</Text>
        {checkpoints.filter(fromCheckpoint => fromCheckpoint.type !== "FINISH").map((fromCheckpoint, fromIndex) => (
          <View key={fromIndex} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleItem(fromIndex)} style={styles.itemHeader}>
              <Text style={styles.itemText}>{fromCheckpoint.name + ((fromCheckpoint.type === "START") ? " (Lähtö)" : "")}</Text>
            </TouchableOpacity>
            {expandedIndex === fromIndex && (
              <View style={styles.formContainer2}>
                <Text style={styles.formText2}>rastiin...</Text>
                {checkpoints.filter(filterCriteria(fromCheckpoint)).map((toCheckpoint, toIndex) => (
                  <View key={toIndex}>
                    <Text>{toCheckpoint.name + ((toCheckpoint.type === "FINISH") ? " (Maali)" : "")}</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.input}
                      value={String(formValues[Number(fromCheckpoint.id)]?.[Number(toCheckpoint.id)] || "")}
                      onChangeText={(value) => handleInputChange(fromCheckpoint.id.toString(), toCheckpoint.id.toString(), value)}
                      maxLength={4}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <Pressable style={styles.button} onPress={() => { setCheckpointDistances() }}>
          <Text style={styles.buttonText}>Aseta</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default CheckpointDistance