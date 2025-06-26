import store from "@/store/store"
import { appendEvent, removeEvent, updateEvent } from "@/reducers/allEventsSlice"
import { Event } from "@/types"
import { getDefaultEventReducer, setEvents } from "@/reducers/eventSlice"

export const setupEventHandlers = (socket: any) => {
  socket.on("event:created", (event: Event) => {
    store.dispatch(appendEvent(event))
  })

  socket.on("event:updated", (event: Event) => {
    const currentEventId = store.getState().event.id
    if (event.id === currentEventId) {
      store.dispatch(setEvents(event))
    }

    store.dispatch(updateEvent(event))
  })

  socket.on("event:deleted", (event: Event) => {
    const currentEventId = store.getState().event.id
    if (event.id === currentEventId) {
      store.dispatch(getDefaultEventReducer())
    }
    store.dispatch(removeEvent(event))
  })

  socket.on("event:limits_updated", (
    { eventId, newMinRouteTime, newMaxRouteTime }:
    { eventId: number, newMinRouteTime: number, newMaxRouteTime: number }
  ) => {
    const currentEvent = store.getState().event
    if (eventId === currentEvent.id) {
      const newEvent: Event = {
        ...currentEvent,
        minRouteTime: newMinRouteTime,
        maxRouteTime: newMaxRouteTime,
      }
      store.dispatch(updateEvent(newEvent))
      store.dispatch(setEvents(newEvent))
    }
  })
}

export const cleanupEventHandlers = (socket: any) => {
  socket.off("event:created")
  socket.off("event:updated")
  socket.off("event:deleted")
  socket.off("event:deleted")
}