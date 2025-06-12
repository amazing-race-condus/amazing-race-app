import { removeCheckpointReducer } from "@/reducers/checkpointsSlice"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Event } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import { handleAlert } from "@/utils/handleAlert"
import { Link, usePathname } from "expo-router"
import React from "react"
import { View, Pressable, TouchableOpacity, Text } from "react-native"
import { useDispatch } from "react-redux"
import { Entypo } from "@expo/vector-icons"

const EventItem = ({ item, handleEventChange }: { item: Event , handleEventChange: (id : number) => void }) => {

  // const item = item

  const handleChangeEvent = (id: number) => {
    handleAlert({
      confirmText: "Vaihda näkymä",
      title: "Vahvista tapahtuman vaihto",
      message: "Oletko varma että haluat tarkistaa toista tapahtumaa? Pääset näkemään menneen tapahtuman ryhmät, rastit ja tulokset.",
      onConfirm: () => handleEventChange(id)
    })
  }

  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.checkpointName}>
          {item.name}
          {/* {translatedType !== "(
            <Text style={styles.checkpointType}> ({translatedType})</Text>
          )} */}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Pressable style={[styles.button2, { flex:1, marginLeft: 8 }]} onPress={() => handleChangeEvent(item.id)}>
            <Text style={styles.buttonText}>Tarkista tapahtumaa</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )

//   return (
//     <Link href={`/checkpoints/${item.id}`} asChild>
//       <TouchableOpacity style={styles.item}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.checkpointName}>
//             {item.name}
//             {translatedType !== "" && (
//               <Text style={styles.checkpointType}> ({translatedType})</Text>
//             )}
//           </Text>
//         </View>
//         <Entypo name="chevron-right" size={24} color="black" />
//       </TouchableOpacity>
//     </Link>
//   )
}

export default EventItem
