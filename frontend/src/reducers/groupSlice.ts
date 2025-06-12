import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllGroups, createGroup, removeGroup, dnfGroup, giveNextCheckpoint, disqualifyGroup} from "@/services/groupService"
import { removePenalty, givePenalty } from "@/services/penaltyService"
import { setNotification } from "./notificationSlice"
import { AxiosError } from "axios"
import type { AddGroup, Group, PenaltyType } from "@/types"

const initialState: Group[] = []

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<Group[]>) {
      return action.payload
    },
    appendGroup(state, action: PayloadAction<Group>) {
      state.push(action.payload)
    },
    updateGroup(state, action: PayloadAction<Group>) {
      const index = state.findIndex(g => g.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    }
  },
})

export const fetchGroups = () => async (dispatch: AppDispatch) => {
  try {
    const allGroups = await getAllGroups(1)

    dispatch(setGroups(allGroups))
  } catch (error) {
    console.error("Failed to fetch groups:", error)
  }
}

export const givePenaltyReducer = (groupId: number, checkpointId: number, penaltyType: PenaltyType, penalty: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const newPenalty = await givePenalty(groupId, checkpointId, penaltyType, penalty)
    const updatedGroups = getState().groups.map((group) => {
      if (group.id === newPenalty.groupId) {
        return {
          ...group,
          penalty: [...group.penalty, newPenalty]
        }
      }
      return group
    })

    dispatch(setGroups(updatedGroups))
    dispatch(setNotification("Ryhmää rangaistu", "success"))
  } catch (error) {
    console.error("Failed to update penalty:", error)
    dispatch(setNotification("Rangaistus ei onnistunut", "error"))
  }
}

export const removePenaltyReducer = (groupId: number, penaltyId:number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    await removePenalty(penaltyId)

    const updatedGroups = getState().groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          penalty: [...group.penalty.filter(penalty => penalty.id !== penaltyId)]
        }
      }
      return group
    })

    dispatch(setGroups(updatedGroups))
    dispatch(setNotification("Rangaistus poistettu", "success"))
  } catch (error) {
    console.error("Failed to remove penalty:", error)
    dispatch(setNotification("Rangaistusta ei voitu poistaa", "error"))
  }
}

export const addGroupReducer = (newObject: AddGroup) => async (dispatch: AppDispatch) => {
  try {
    const newGroup = await createGroup(newObject, 1)
    dispatch(appendGroup(newGroup))
    dispatch(setNotification(`Ryhmä '${newObject.name}' lisätty`, "success"))
  } catch (error) {
    console.error("Failed to add Group:", error)
    if (error instanceof AxiosError) {
      dispatch(setNotification(
        error.response?.data.error ?? `Ryhmää '${newObject.name}' ei voitu lisätä: ${error.message}`, "error"
      ))
    }
  }
}

export const removeGroupReducer =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const group = await removeGroup(id)

      const current = getState().groups
      const updated = current.filter((groups) => groups.id !== id)

      dispatch(setGroups(updated))
      dispatch(setNotification(`Ryhmä '${group.name}' poistettu`, "success"))
    } catch (error) {
      console.error("Failed to remove checkpoint:", error)
      dispatch(setNotification("Ryhmää ei voitu poistaa", "error"))
    }
  }

export const dnfGroupReducer =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const group = await dnfGroup(id)

      const currentGroups = getState().groups
      let dnfState: boolean | undefined
      const updated = currentGroups.map((currentGroup) => {
        if (currentGroup.id === id) {
          dnfState = !currentGroup.dnf
          return {
            ...currentGroup,
            dnf: !currentGroup.dnf
          }
        }
        return currentGroup
      })

      dispatch(setGroups(updated))
      if (dnfState) {
        dispatch(setNotification(`Ryhmän '${group.name}' suoritus keskeytetty `, "success"))
      } else {
        dispatch(setNotification(`Ryhmän '${group.name}' suoritusta jatkettu `, "success"))
      }
    } catch (error) {
      console.error("Failed to dnf group:", error)
      dispatch(setNotification("Ryhmän suoritusta ei voitu keskeyttää", "error"))
    }
  }

export const disqualifyGroupReducer =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const group = await disqualifyGroup(id)

      const currentGroups = getState().groups
      let disqualifiedState: boolean | undefined
      const updated = currentGroups.map((currentGroup) => {
        if (currentGroup.id === id) {
          disqualifiedState = !currentGroup.disqualified
          return {
            ...currentGroup,
            disqualified: !currentGroup.disqualified
          }
        }
        return currentGroup
      })

      dispatch(setGroups(updated))
      if (disqualifiedState) {
        dispatch(setNotification(`Ryhmän '${group.name}' suoritus hylätty `, "success"))
      } else {
        dispatch(setNotification(`Ryhmän '${group.name}' hylkäys peruttu `, "success"))
      }
    } catch (error) {
      console.error("Failed to disqualify group:", error)
      dispatch(setNotification("Ryhmän suoritusta ei voitu hylätä", "error"))
    }
  }

export const giveNextCheckpointReducer =
  (groupId: number, checkpointId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const updatedGroup = await giveNextCheckpoint(groupId, checkpointId)
      const currentGroups = getState().groups
      const updated = currentGroups.map((currentGroup) => {
        if (currentGroup.id === groupId) {
          return {
            ...currentGroup,
            nextCheckpointId: updatedGroup.nextCheckpointId,
            finishTime: updatedGroup.finishTime
          }
        }
        return currentGroup
      })
      dispatch(setGroups(updated))
      dispatch(setNotification(`Ryhmä '${updatedGroup.name}' siirtyi seuraavalle rastille `, "success"))
    } catch (error) {
      console.error("Failed to give next checkpoint to the group:", error)
      dispatch(setNotification("Ryhmän suoritusta ei voitu jatkaa", "error"))
    }
  }

export const { setGroups , appendGroup, updateGroup } = groupSlice.actions
export default groupSlice.reducer