import store from "@/store/store"
import { updateGroup, removeGroup, appendGroup } from "@/reducers/groupSlice"
import { Group } from "@/types"

export const setupGroupHandlers = (socket: any) => {
  socket.on("group:created", (group: Group) => {
    store.dispatch(appendGroup(group))
  })

  socket.on("group:updated", (group: Group) => {
    store.dispatch(updateGroup(group))
  })

  socket.on("group:deleted", (group: Group) => {
    store.dispatch(removeGroup(group))
  })
}

export const cleanupGroupHandlers = (socket: any) => {
  socket.off("group:created")
  socket.off("group:updated")
  socket.off("group:deleted")
}