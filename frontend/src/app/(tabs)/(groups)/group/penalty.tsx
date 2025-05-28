import store, { AppDispatch, RootState } from "@/store/store"
import { Stack, useLocalSearchParams } from "expo-router"
import { Alert, Platform, Pressable, Text, TouchableOpacity, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { Entypo } from "@expo/vector-icons"
import { fetchPenaltyReducer, givePenaltyReducer } from "@/reducers/groupSlice"
import React, { useState , useEffect, use } from "react"

type PenaltyProps = {
  id: string
}

const Penalty = ({ id }: PenaltyProps) => {
  // const { id } = useLocalSearchParams<{ id: string }>()
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  // const groups = store.getState().groups
  const group = useSelector((state: RootState) =>
    state.groups.find(group => group.id === Number(id))
  )

  console.log("Group:", group)

  const [visible, setVisible] = useState(false)

  // useEffect(() => {
  //   if (id) {
  //     dispatch(fetchPenaltyReducer(Number(id)))
  //   }
  // }, [id, dispatch])

  return (
    <View style={styles.container}>
      {/* <Pressable style={styles.item} onPress={() => {setVisible(!visible)}}>
        <Text style={styles.checkpointName}>Rangaistus</Text>
      </Pressable> */}

      <TouchableOpacity style={styles.item}
        onPress={() => setVisible(!visible)}>
        <Text style={styles.checkpointName}>
            Rangaistus
        </Text>
        <Entypo name="chevron-right" size={24} color="black" style={ {
          transform: [{ rotate: visible ? "90deg" : "0deg" }]
        }}/>
      </TouchableOpacity>

      {visible &&

        <View style={styles.container}>
          <Text>Rangaistus</Text>

          <View style={styles.item}>
            <Text style={styles.checkpointName}>Anna rangaistus</Text>
            <TouchableOpacity
              onPress={() => {
                if (id) {
                  dispatch(givePenaltyReducer(Number(id), 5))
                }
              }}
            >
              <Entypo name="plus" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.item}>
            <Text style={styles.checkpointName}>Rangaistukset</Text>
            {group?.penalty && group.penalty.length > 0 ? (
              group.penalty.map((penalty) => (
                <Text key={penalty.id} style={styles.checkpointName}>
                  {penalty.time} minuuttia
                </Text>
              ))
            ) : (
              <Text style={styles.checkpointName}>Ei rangaistuksia</Text>
            )}
          </View>
        </View>
      }
    </View>
  )
}

export default Penalty