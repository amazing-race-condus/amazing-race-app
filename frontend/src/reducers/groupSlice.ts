import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllGroups, createGroup, removeGroup } from "@/services/groupService"
import { removePenalty, givePenalty } from "@/services/penaltyService"
import { setNotification } from "./notificationSlice"
import { AxiosError } from "axios"
import type { AddGroup, Group } from "@/types"

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
    const allGroups = await getAllGroups()

    dispatch(setGroups(allGroups))
  } catch (error) {
    console.error("Failed to fetch groups:", error)
  }
}

export const givePenaltyReducer = (id: number, penalty: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const penalte = await givePenalty(id, penalty)
    const updatedGroups = getState().groups.map((group) => {
      if (group.id === penalte.group_id) {
        return {
          ...group,
          penalty: [...group.penalty, penalte]
        }
      }
      return group
    })

    dispatch(setGroups(updatedGroups))
    dispatch(setNotification("Ryhmä rangaistu", "success"))
  } catch (error) {
    console.error("Failed to update penalty:", error)
    dispatch(setNotification("Rangaistus ei onnistunut", "error"))
  }
}

export const removePenaltyReducer = (id: number, penaltyId:number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    await removePenalty(penaltyId)

    const updatedGroups = getState().groups.map((group) => {
      if (group.id === id) {
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
    const newCheckpoint = await createGroup(newObject)
    dispatch(appendGroup(newCheckpoint))
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

export const { setGroups , appendGroup, updateGroup } = groupSlice.actions
export default groupSlice.reducer