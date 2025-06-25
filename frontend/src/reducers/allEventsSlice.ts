import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Event } from "@/types"

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

export const { setEvents, appendEvent, removeEvent, updateEvent } = allEventsSlice.actions
export default allEventsSlice.reducer