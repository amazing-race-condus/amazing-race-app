import { appendCheckpoint, updateCheckpoint, removeCheckpoint } from "@/reducers/checkpointsSlice"
import store from "@/store/store"
import { Checkpoint } from "@/types"

export const setupCheckpointHandlers = (socket: any) => {
  socket.on("checkpoint:created", (checkpoint: Checkpoint) => {
    const currentEventId = store.getState().event.id
    if (currentEventId === checkpoint.eventId) {
      store.dispatch(appendCheckpoint(checkpoint))
    }
  })

  socket.on("checkpoint:updated", (checkpoint: Checkpoint) => {
    store.dispatch(updateCheckpoint(checkpoint))
  })

  socket.on("checkpoint:deleted", (checkpointId: number) => {
    store.dispatch(removeCheckpoint(checkpointId))
  })
}

export const cleanupCheckpointHandlers = (socket: any) => {
  socket.off("checkpoint:created")
  socket.off("checkpoint:updated")
  socket.off("checkpoint:deleted")
}