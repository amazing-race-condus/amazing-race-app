import { RootState } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Event } from "@/types"
import { handleAlert } from "@/utils/handleAlert"
import React from "react"
import { View, Pressable, Text } from "react-native"
import { useSelector } from "react-redux"

const EventItem = ({ item, handleEventChange, onEditEvent }: { item: Event, handleEventChange: (id : number) => void,  onEditEvent?: (event: Event) => void }) => {
  const eventId = useSelector((state: RootState) => state.event.id)
  const user = useSelector((state: RootState) => state.user)

  const handleChangeEvent = (id: number) => {
    handleAlert({
      confirmText: "Vaihda näkymä",
      title: "Vahvista tapahtuman vaihto",
      message: "Oletko varma että haluat tarkastella toista tapahtumaa? Pääset näkemään menneen tapahtuman ryhmät, rastit ja tulokset.",
      onConfirm: () => handleEventChange(id)
    })
  }

  return (
    <View style={[styles.item, item.id === eventId ? { backgroundColor: "rgba(0, 254, 51, 0.66)" } : null]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.checkpointName}>
          {item.name}
        </Text>

        {item.id !== eventId ? (
          <Pressable
            style={[ styles.button2, { flex: 1, marginLeft: 8, padding: 7, marginTop: 15 } ]}
            onPress={() => handleChangeEvent(item.id)}
          >
            <Text style={styles.buttonText}>Tarkastele tapahtumaa</Text>
          </Pressable>
        ) : (
          <View style={{
            flex: 1,
            marginLeft: 0,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text style={[styles.buttonText]}>Aktiivinen tapahtuma</Text>
          </View>
        )}
        { user.admin && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Pressable style={[ styles.button2, { flex: 1, marginLeft: 8, padding: 5, marginTop: 10 } ]} onPress={() => console.log("poistetaan")}>
                <Text style={styles.buttonText}>Poista</Text>
              </Pressable>
              <Pressable style={[styles.button2, { flex:1, marginLeft: 8, padding: 5, marginTop: 10 }]} onPress={() => onEditEvent?.(item)}>
                <Text style={styles.buttonText}>Muokkaa</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>

    </View>
  )
}

export default EventItem
