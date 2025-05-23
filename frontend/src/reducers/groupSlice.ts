import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllGroups, createGroup, removeGroup } from "@/services/groupService"
import { setNotification } from "./responseSlice"
import { AxiosError } from "axios"
import { useRouter } from "expo-router"

export interface groupState {
    id : string,
    name : string
}

const initialState: groupState[] = [
  {
    id: "idfs",
    name: "IcedLimeTeam"
  },
  {
    id: "diafs",
    name: "NooobydoobyTeam"
  },
]

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

export const addGroupReducer = (newObject: groupState, name: string) => async (dispatch: AppDispatch) => {
  try {
    const newCheckpoint = await createGroup(newObject)
    const router = useRouter()
    dispatch(appendGroup(newCheckpoint))
    dispatch(setNotification(`Ryhmä '${name}' lisätty`, "success"))
    router.navigate("/checkpoints")
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

      // get current state
      const current = getState().checkpoints
      const updated = current.filter((checkpoint) => checkpoint.id !== id)

      dispatch(setGroups(updated))
      dispatch(setNotification(`Ryhmä '${name}' poistettu`, "success"))
    } catch (error) {
      console.error("Failed to remove checkpoint:", error)
      dispatch(setNotification(`Ryhmää ${name} ei voitu poistaa`, "error"))
    }
}

export const { setGroups , appendGroup } = groupSlice.actions
export default groupSlice.reducer