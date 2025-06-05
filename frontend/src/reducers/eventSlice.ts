import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { startGame, endGame , getEvent } from "@/services/eventService"
import { setNotification } from "./notificationSlice"
import type { Event } from "@/types"

const initialState: Event = {
  id: 1,
  startTime: null,
  endTime: null,
  name: "",
  groups: [],
  checkpoints: [],
  routeLimits: [],
  distances: {}
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
    console.log(id)
    const event = await getEvent(1)
    console.log(event)
    dispatch(setEvents(event))
  } catch (error) {
    console.error("Failed to start the game:", error)
    dispatch(setNotification("Pelin aloitus epäonnistui", "error"))
  }
}

export const setStartReducer = (id : number) => async (dispatch: AppDispatch) => {
  try {
    const updatedEvent = await startGame(id)
    console.log("Updated Event:", updatedEvent)
    dispatch(setEvents(updatedEvent))
    dispatch(setNotification("Peli aloitettu", "success"))
  } catch (error) {
    console.error("Failed to start the game:", error)
    dispatch(setNotification("Pelin aloitus epäonnistui", "error"))
  }
}

export const setEndReducer = (id : number) => async (dispatch: AppDispatch) => {
  try {
    const updatedEvent = await endGame(id)
    console.log("Updated Event:", updatedEvent)
    dispatch(setEvents(updatedEvent))
    dispatch(setNotification("Peli päätetty", "success"))
  } catch (error) {
    console.error("Failed to start the game:", error)
    dispatch(setNotification("Pelin päätös epäonnistui", "error"))
  }
}

export const { setEvents } = eventSlice.actions
export default eventSlice.reducer
