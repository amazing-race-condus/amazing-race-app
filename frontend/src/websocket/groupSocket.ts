import store from "@/store/store"
import { updateGroup, removeGroup, appendGroup, fetchGroups } from "@/reducers/groupSlice"
import { Group } from "@/types"

export const setupGroupHandlers = (socket: any) => {
  socket.on("group:created", (group: Group) => {
    const currentEventId = store.getState().event.id
    if (currentEventId === group.eventId) {
      store.dispatch(appendGroup(group))
    }
  })

  socket.on("group:updated", (group: Group) => {
    store.dispatch(updateGroup(group))
  })

  socket.on("group:deleted", (group: Group) => {
    store.dispatch(removeGroup(group))
  })

  socket.on("groups:routes_generated", () => {
    const currentEventId = store.getState().event.id
    store.dispatch(fetchGroups(currentEventId))
  })
}

export const cleanupGroupHandlers = (socket: any) => {
  socket.off("group:created")
  socket.off("group:updated")
  socket.off("group:deleted")
  socket.off("groups:routes_generated")
}