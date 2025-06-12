import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import store ,{ AppDispatch } from "@/store/store"
import { startGame, endGame , getEvent } from "@/services/eventService"
import { setNotification } from "./notificationSlice"
import type { Event } from "@/types"

const initialState: Event = {
  id: 1,
  startTime: null,
  endTime: null,
  name: "",
  group: [],
  checkpoints: [],
  routeLimits: [],
  minRouteTime: null,
  maxRouteTime: null,
  penalties: []
}

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Event>) {
      return action.payload
    }
  },
})

export const getEventReducer = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const event = await getEvent(id)
    console.log(event)
    dispatch(setEvents(event))
  } catch (error) {
    console.error("Failed to fetch event:", error)
    dispatch(setNotification("Tapahtuman haku epäonnistui", "error"))
  }
}

export const setStartReducer = () => async (dispatch: AppDispatch) => {
  try {
    const id = store.getState().event.id
    const updatedEvent = await startGame(id)
    const time = new Date(updatedEvent.startTime!)
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    dispatch(setEvents(updatedEvent))
    dispatch(setNotification(`Peli aloitettu ${hours}:${minutes}`, "success"))
  } catch (error) {
    console.error("Failed to start the game:", error)
    dispatch(setNotification("Pelin aloitus epäonnistui", "error"))
  }
}

export const setEndReducer = () => async (dispatch: AppDispatch) => {
  try {
    const id = store.getState().event.id
    const updatedEvent = await endGame(id)
    const time = new Date(updatedEvent.endTime!)
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    dispatch(setEvents(updatedEvent))
    dispatch(setNotification(`Peli päätetty ${hours}:${minutes}`, "success"))
  } catch (error) {
    console.error("Failed to end the game:", error)
    dispatch(setNotification("Pelin päätös epäonnistui", "error"))
  }
}

export const { setEvents } = eventSlice.actions
export default eventSlice.reducer
