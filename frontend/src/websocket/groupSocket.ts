import store from "@/store/store"
import { updateGroup, removeGroup, appendGroup } from "@/reducers/groupSlice"
import { Group } from "@/types"

export const setupGroupHandlers = (socket: any) => {
  socket.on("group:created", (group: Group) => {
    console.log("Group created:", group)
    store.dispatch(appendGroup(group))
  })

  socket.on("group:updated", (group: Group) => {
    console.log("Group updated:", group)
    store.dispatch(updateGroup(group))
  })

  socket.on("group:deleted", (group: Group) => {
    console.log("Group deleted:", group)
    store.dispatch(removeGroup(group))
  })
}

export const cleanupGroupHandlers = (socket: any) => {
  socket.off("group:created")
  socket.off("group:updated")
  socket.off("group:deleted")
}