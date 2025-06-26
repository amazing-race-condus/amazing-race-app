import { AppDispatch, RootState } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Event } from "@/types"
import { handleAlert } from "@/utils/handleAlert"
import React from "react"
import { View, Pressable, Text } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { formatDate } from "@/utils/timeUtils"
import { removeEventReducer } from "@/reducers/allEventsSlice"

const EventItem = ({ item, handleEventChange, onEditEvent }: { item: Event, handleEventChange: (id : number) => void,  onEditEvent?: (event: Event) => void }) => {
  const eventId = useSelector((state: RootState) => state.event.id)
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const handleChangeEvent = (id: number) => {
    handleAlert({
      confirmText: "Vaihda näkymä",
      title: "Vahvista tapahtuman vaihto",
      message: "Oletko varma että haluat tarkastella toista tapahtumaa? Pääset näkemään menneen tapahtuman ryhmät, rastit ja tulokset.",
      onConfirm: () => handleEventChange(id)
    })
  }

  const handleRemoveEvent = (id: number) => {
    handleAlert({
      confirmText: "Poista",
      title: "Vahvista poisto",
      message: "Oletko varma että haluat poistaa tämän tapahtuman? Tapahtuman poistaminen poistaa myös kaikki siihen liittyvät ryhmät, rastit ja tiedot.",
      onConfirm: async () => {
        dispatch(removeEventReducer(id, eventId))
      }
    })
  }

  return (
    <View style={[styles.item, item.id === eventId ? { backgroundColor: "rgba(0, 254, 51, 0.66)" } : null]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.checkpointName}>
          {item.name}
        </Text>
        <Text style={[styles.checkpointName, { fontSize: 12 }]}>
          {formatDate(new Date(item.eventDate))}
        </Text>

        {item.id !== eventId ? (
          <Pressable
            style={({ pressed }) => [styles.button2, {paddingHorizontal: 12, padding: 5, opacity: pressed ? 0.5 : 1 }]}
            onPress={() => handleChangeEvent(item.id)}
          >
            <Text style={styles.buttonText}>Tarkastele tapahtumaa</Text>
          </Pressable>
        ) : (
          <View style={{
            flex: 1,
            marginLeft: 0,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal:12
          }}>
            <Text style={[styles.buttonText]}>Aktiivinen tapahtuma</Text>
          </View>
        )}
        { user.admin && (

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <Pressable style={({ pressed }) => [styles.button2, {opacity: pressed ? 0.5 : 1 }]} onPress={() => handleRemoveEvent(Number(item.id))}>
              <Text style={styles.buttonText}>Poista</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.button2, {opacity: pressed ? 0.5 : 1 }]} onPress={() => onEditEvent?.(item)}>
              <Text style={styles.buttonText}>Muokkaa</Text>
            </Pressable>
          </View>

        )}
      </View>

    </View>
  )
}

export default EventItem
