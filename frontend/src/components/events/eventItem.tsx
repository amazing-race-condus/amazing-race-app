import { styles } from "@/styles/commonStyles"
import { Event } from "@/types"
import { handleAlert } from "@/utils/handleAlert"
import React from "react"
import { View, Pressable, Text } from "react-native"

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
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Pressable style={[styles.button2, { flex:1, marginLeft: 8 }]} onPress={() => handleChangeEvent(item.id)}>
            <Text style={styles.buttonText}>Tarkista tapahtumaa</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default EventItem
