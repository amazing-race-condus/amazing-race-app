import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllCheckpoints, removeCheckpoint, createCheckpoint } from "@/services/checkpointService"
import { setNotification } from "./responseSlice"
import { AxiosError } from "axios"
import { useRouter } from "expo-router"

export interface checkpointState {
    id : string,
    name : string
}

const initialState: checkpointState[] = []

const checkpointSlice = createSlice({
  name: "checkpoints",
  initialState,
  reducers: {
    setCheckpoints(state, action: PayloadAction<checkpointState[]>) {
      return action.payload
    },
    appendCheckpoint(state, action: PayloadAction<checkpointState>) {
      state.push(action.payload)
    }
  },
})

export const fetchCheckpoints = () => async (dispatch: AppDispatch) => {
  try {
    const allCheckpoints = await getAllCheckpoints()
    dispatch(setCheckpoints(allCheckpoints))
  } catch (error) {
    console.error("Failed to fetch checkpoints:", error)
  }
}

export const addCheckpoitReducer = (newObject: checkpointState, name: string) => async (dispatch: AppDispatch) => {
  try {
    const newCheckpoint = await createCheckpoint(newObject)
    const router = useRouter()
    dispatch(appendCheckpoint(newCheckpoint))
    dispatch(setNotification(`Rasti '${name}' lisätty`, "success"))
    router.navigate("/checkpoints")
  } catch (error) {
    console.error("Failed to add checkpoint:", error)
    if (error instanceof AxiosError) {
      dispatch(setNotification(
        error.response?.data.error ?? `Rastia '${name}' ei voitu lisätä: ${error.message}`, "error"
      ))
    }
  }
}

export const removeCheckpointReducer =
  (id: string, name: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await removeCheckpoint(id)

      // get current state
      const current = getState().checkpoints
      const updated = current.filter((checkpoint) => checkpoint.id !== id)

      dispatch(setCheckpoints(updated))
      dispatch(setNotification(`Rasti '${name}' poistettu`, "success"))
    } catch (error) {
      console.error("Failed to remove checkpoint:", error)
      dispatch(setNotification(`Rastia ${name} ei voitu poistaa`, "error"))
    }
  }

export const { setCheckpoints , appendCheckpoint } = checkpointSlice.actions
export default checkpointSlice.reducer