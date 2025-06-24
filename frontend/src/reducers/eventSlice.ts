import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "@/store/store"
import { startGame, endGame , getEvent, getDefaultEvent } from "@/services/eventService"
import { setNotification } from "./notificationSlice"
import { Event } from "@/types"

const initialState: Event = {
  id: null as unknown as number,
  startTime: null,
  endTime: null,
  name: "",
  group: [],
  checkpoints: [],
  minRouteTime: null,
  maxRouteTime: null,
  eventDate: new Date(),
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
    dispatch(setEvents(event))
  } catch (error) {
    console.error("Failed to fetch event:", error)
    dispatch(setNotification("Tapahtuman haku epäonnistui", "error"))
  }
}

export const getDefaultEventReducer = () => async (dispatch: AppDispatch) => {
  try {
    const event = await getDefaultEvent()
    dispatch(setEvents(event))
    return event
  } catch (error) {
    console.error("Failed to fetch event:", error)
    dispatch(setNotification("Tapahtuman haku epäonnistui", "error"))
  }
}

export const setStartReducer = (id : number) => async (dispatch: AppDispatch) => {
  try {
    const updatedEvent = await startGame(id)
    const time = new Date(updatedEvent.startTime!)
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    dispatch(setEvents(updatedEvent))
    dispatch(setNotification(`Peli ${updatedEvent.name} aloitettu ${hours}:${minutes}`, "success"))
  } catch (error) {
    console.error("Failed to start the game:", error)
    dispatch(setNotification("Pelin aloitus epäonnistui", "error"))
  }
}

export const setEndReducer = (id : number) => async (dispatch: AppDispatch) => {
  try {
    const updatedEvent = await endGame(id)
    const time = new Date(updatedEvent.endTime!)
    const datetext = time.toTimeString().split(" ")[0].split(":")
    const hours = datetext[0]
    const minutes = datetext[1]
    dispatch(setEvents(updatedEvent))
    dispatch(setNotification(`Peli ${updatedEvent.name} päätetty ${hours}:${minutes}`, "success"))
  } catch (error) {
    console.error("Failed to end the game:", error)
    dispatch(setNotification("Pelin päätös epäonnistui", "error"))
  }
}

export const { setEvents } = eventSlice.actions
export default eventSlice.reducer
