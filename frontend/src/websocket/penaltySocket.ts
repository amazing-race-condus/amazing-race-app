import store from "@/store/store"
import { updateGroup } from "@/reducers/groupSlice"
import { Penalty } from "@/types"

export const setupPenaltyHandlers = (socket: any) => {
  socket.on("penalty:created", (penalty: Penalty) => {
    const groupId = penalty.groupId
    const group = store.getState().groups.filter(g => g.id === groupId)[0]
    const penalizedGroup = {
      ...group,
      penalty: group.penalty.some(p => p.id === penalty.id)
        ? group.penalty
        : [...group.penalty, penalty]
    }
    store.dispatch(updateGroup(penalizedGroup))
  })

  socket.on("penalty:deleted", (penalty: Penalty) => {
    const groupId = penalty.groupId
    const group = store.getState().groups.filter(g => g.id === groupId)[0]
    const unPenalizedGroup = {
      ...group,
      penalty: group.penalty.filter(p => p.id !== penalty.id)
    }
    store.dispatch(updateGroup(unPenalizedGroup))
  })
}

export const cleanupPenaltyHandlers = (socket: any) => {
  socket.off("penalty:created")
  socket.off("penalty:deleted")
}