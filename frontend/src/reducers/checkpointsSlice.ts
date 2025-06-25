import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllCheckpoints, removeCheckpoint, createCheckpoint } from "@/services/checkpointService"
import { setNotification } from "./notificationSlice"
import { AxiosError } from "axios"
import { Checkpoint, AddCheckpoint } from "@/types"

const initialState: Checkpoint[] = []

const checkpointSlice = createSlice({
  name: "checkpoints",
  initialState,
  reducers: {
    setCheckpoints(state, action: PayloadAction<Checkpoint[]>) {
      return action.payload
    },
    appendCheckpoint(state, action: PayloadAction<Checkpoint>) {
      state.push(action.payload)
    },
    updateCheckpoint(state, action: PayloadAction<Checkpoint>) {
      const index = state.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    }
  },
})

export const fetchCheckpoints = (eventId : number) => async (dispatch: AppDispatch) => {
  try {
    const allCheckpoints = await getAllCheckpoints(eventId)
    dispatch(setCheckpoints(allCheckpoints))
  } catch (error) {
    console.error("Failed to fetch checkpoints:", error)
  }
}

export const addCheckpointReducer = (newObject: AddCheckpoint) => async (dispatch: AppDispatch) => {
  try {
    const newCheckpoint = await createCheckpoint(newObject)
    dispatch(appendCheckpoint(newCheckpoint))
    dispatch(setNotification(`Rasti '${newObject.name}' lisätty`, "success"))
  } catch (error) {
    console.error("Failed to add checkpoint:", error)
    if (error instanceof AxiosError) {
      dispatch(setNotification(
        error.response?.data.error ?? `Rastia '${newObject.name}' ei voitu lisätä: ${error.message}`, "error"
      ))
    }
  }
}

export const removeCheckpointReducer =
  (id: number, name: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
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

export const { setCheckpoints , appendCheckpoint, updateCheckpoint } = checkpointSlice.actions
export default checkpointSlice.reducer