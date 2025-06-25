import store from "@/store/store"
import { updateGroup, removeGroup, appendGroup } from "@/reducers/groupSlice"
import { Event, Group } from "@/types"

export const setupEventHandlers = (socket: any) => {
  socket.on("event:created", (event: Event) => {
    console.log("Event created", event)
    // store.dispatch(appendGroup(group))
  })

  socket.on("event:updated", (event: Event) => {
    console.log("Event updated", event)
    // store.dispatch(updateGroup(group))
  })

  socket.on("event:deleted", (event: Event) => {
    console.log("Event deleted", event)
    // store.dispatch(removeGroup(event))
  })
}

export const cleanupEventHandlers = (socket: any) => {
  socket.off("event:created")
  socket.off("event:updated")
  socket.off("event:deleted")
}