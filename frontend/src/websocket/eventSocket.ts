import store from "@/store/store"
import { appendEvent, removeEvent, updateEvent } from "@/reducers/allEventsSlice"
import { Event } from "@/types"

export const setupEventHandlers = (socket: any) => {
  socket.on("event:created", (event: Event) => {
    store.dispatch(appendEvent(event))
  })

  socket.on("event:updated", (event: Event) => {
    store.dispatch(updateEvent(event))
  })

  socket.on("event:deleted", (event: Event) => {
    store.dispatch(removeEvent(event))
  })
}

export const cleanupEventHandlers = (socket: any) => {
  socket.off("event:created")
  socket.off("event:updated")
  socket.off("event:deleted")
}