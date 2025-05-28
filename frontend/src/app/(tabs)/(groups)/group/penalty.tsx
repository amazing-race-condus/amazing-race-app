import { AppDispatch } from "@/store/store"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Alert, Platform, Pressable, Text, TouchableOpacity, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch } from "react-redux"
import { Entypo } from "@expo/vector-icons"
import { removeGroupReducer } from "@/reducers/groupSlice"
import React, { useState } from "react"

const Penalty = () => {
  //const { id, name } = useLocalSearchParams<{id: string, name: string}>()
//   const dispatch: AppDispatch = useDispatch<AppDispatch>()
//   const router = useRouter()

  const [visible, setVisible] = useState(false)

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
        </View>
      }
    </View>
  )
}

export default Penalty