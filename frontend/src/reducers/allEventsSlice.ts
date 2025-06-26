import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AddEvent, Event } from "@/types"
import { AppDispatch, RootState } from "@/store/store"
import { createEvent, getEvents, removeEvent as removeEventSVC } from "@/services/eventService"
import { setNotification } from "./notificationSlice"
import { AxiosError } from "axios"
import { getDefaultEventReducer } from "./eventSlice"
import { storageUtil } from "@/utils/storageUtil"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { useSelector } from "react-redux"

const initialState: Event[] = []

const allEventsSlice = createSlice({
  name: "allEvents",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Event[]>) {
      return action.payload
    },
    appendEvent(state, action: PayloadAction<Event>) {
      const eventExists = state.some(e => e.id === action.payload.id)
      if (!eventExists) {
        state.push(action.payload)
      }
    },
    removeEvent(state, action: PayloadAction<Event>) {
      return state.filter(e => e.id !== action.payload.id)
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const index = state.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    }
  },
})

export const fetchEvents = () => async (dispatch: AppDispatch) => {
  try {
    const allEvents = await getEvents()
    dispatch(setEvents(allEvents))
  } catch (error) {
    console.error("Failed to fetch events:", error)
  }
}

export const addEventReducer = (newObject: AddEvent) => async (dispatch: AppDispatch) => {
  try {
    const newEvent = await createEvent(newObject)
    dispatch(appendEvent(newEvent))
    dispatch(setNotification(`Tapahtuma '${newObject.name}' lisätty`, "success"))
  } catch (error) {
    console.error("Failed to add event:", error)
    if (error instanceof AxiosError) {
      dispatch(setNotification(
        error.response?.data.error ?? `Tapahtumaa ei voitu luoda: ${error.message}`, "error"
      ))
    }
  }
}

export const removeEventReducer =
  (eventId: number, activeEventId: number) => async (dispatch: AppDispatch) => {
    try {
      const event = await removeEventSVC(eventId)
      dispatch(removeEvent(event))
      dispatch(setNotification("Tapahtuman poisto onnistui", "success"))
      if (eventId === activeEventId) {
        const newActiveEvent = await dispatch(getDefaultEventReducer())
        if (newActiveEvent) {
          await storageUtil.setEventId(newActiveEvent.id)
          dispatch(fetchGroups(newActiveEvent.id))
          dispatch(fetchCheckpoints(newActiveEvent.id))
        }
      }
    } catch (error) {
      console.error("Failed to remove event:", error)
      if (error instanceof AxiosError) {
        dispatch(setNotification( error.response?.data.error ?? `Tapahtumaa ei voi poistaa: ${error.message}`, "error"))
      }
    }
  }

export const { setEvents, appendEvent, removeEvent, updateEvent } = allEventsSlice.actions
export default allEventsSlice.reducer