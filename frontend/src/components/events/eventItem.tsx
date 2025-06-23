import { AppDispatch, RootState } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Event } from "@/types"
import { handleAlert } from "@/utils/handleAlert"
import React from "react"
import { View, Pressable, Text } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { removeEvent } from "@/services/eventService"
import { setNotification } from "@/reducers/notificationSlice"
import { AxiosError } from "axios"
import { formatDate } from "@/utils/timeUtils"
import { getDefaultEventReducer } from "@/reducers/eventSlice"

const EventItem = ({ item, setEvents, events, handleEventChange, onEditEvent }: { item: Event, setEvents: (event: Event[]) => void, events: Event[], handleEventChange: (id : number) => void,  onEditEvent?: (event: Event) => void }) => {
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
        try {
          const deletedEvent = await removeEvent(id)
          const updatedEvents = events.filter(event => event.id !== deletedEvent.id)
          setEvents(updatedEvents)
          dispatch(setNotification("Tapahtuman poisto onnistui", "success"))
          dispatch(getDefaultEventReducer())
        } catch (error) {
          if (error instanceof AxiosError) {
            dispatch(setNotification( error.response?.data.error ?? `Tapahtumaa ei voi poistaa: ${error.message}`, "error"))
          }
        }
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

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Pressable style={[ styles.button2, { flex: 1, marginLeft: 8, padding: 5, marginTop: 10 } ]} onPress={() => handleRemoveEvent(Number(item.id))}>
              <Text style={styles.buttonText}>Poista</Text>
            </Pressable>
            <Pressable style={[styles.button2, { flex:1, marginLeft: 8, padding: 5, marginTop: 10 }]} onPress={() => onEditEvent?.(item)}>
              <Text style={styles.buttonText}>Muokkaa</Text>
            </Pressable>
          </View>

        )}
      </View>

    </View>
  )
}

export default EventItem
