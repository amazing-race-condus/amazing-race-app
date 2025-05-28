import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllGroups, createGroup, removeGroup, updateGroupPenalty } from "@/services/groupService"
import { getPenalty, givePenalty } from "@/services/penaltyService"
import { setNotification } from "./responseSlice"
import { AxiosError } from "axios"

export interface groupState {
    id : string,
    name : string,
    penalty: number[],
    disqualified: boolean,
}

const initialState: groupState[] = []

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<groupState[]>) {
      return action.payload
    },
    appendGroup(state, action: PayloadAction<groupState>) {
      state.push(action.payload)
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

export const updateReducer = (id: string, penalty: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    // const body = {
    //   penalty: penalty,
    // }
    const updated = await updateGroupPenalty(id, penalty)

    dispatch(setGroups(updated))
    dispatch(setNotification("Ryhmä rangaistu", "success"))
  } catch (error) {
    console.error("Failed to update penalty:", error)
    dispatch(setNotification("Rangaistus ei onnistunut", "error"))
  }
}

export const addGroupReducer = (newObject: groupState, name: string) => async (dispatch: AppDispatch) => {
  try {
    const newCheckpoint = await createGroup(newObject)
    dispatch(appendGroup(newCheckpoint))
    dispatch(setNotification(`Ryhmä '${name}' lisätty`, "success"))
  } catch (error) {
    console.error("Failed to add Group:", error)
    if (error instanceof AxiosError) {
      dispatch(setNotification(
        error.response?.data.error ?? `Ryhmää '${name}' ei voitu lisätä: ${error.message}`, "error"
      ))
    }
  }
}

export const removeGroupReducer =
  (id: string, name: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await removeGroup(id)

      const current = getState().groups
      const updated = current.filter((groups) => groups.id !== id)

      dispatch(setGroups(updated))
      dispatch(setNotification(`Ryhmä '${name}' poistettu`, "success"))
    } catch (error) {
      console.error("Failed to remove checkpoint:", error)
      dispatch(setNotification(`Ryhmää ${name} ei voitu poistaa`, "error"))
    }
  }

export const { setGroups , appendGroup } = groupSlice.actions
export default groupSlice.reducer