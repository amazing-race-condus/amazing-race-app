import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllCheckpoints, removeCheckpoint, createCheckpoint } from "@/services/checkpointService"
import { setNotification } from "./responseSlice"

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
    dispatch(appendCheckpoint(newCheckpoint))
    dispatch(setNotification(`Rasti '${name}' lisätty`, "success"))
  } catch (error) {
    console.error("Failed to add checkpoint:", error)
    dispatch(setNotification(`Rastia '${name}' ei voitu lisätä`, "error"))
  }
}

export const removeCheckpointReducer =
  (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      await removeCheckpoint(id)

      // get current state
      const current = getState().checkpoints
      const updated = current.filter((checkpoint) => checkpoint.id !== id)

      dispatch(setCheckpoints(updated))
    } catch (error) {
      console.error("Failed to remove checkpoint:", error)
    }
  }

export const { setCheckpoints , appendCheckpoint } = checkpointSlice.actions
export default checkpointSlice.reducer