import { AppDispatch } from "@/store/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Notification } from "@/types"

const initialState: Notification = {
  message: "",
  type: null
}

const messageSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<Notification>) {
      return action.payload
    }
  },
})

let timeoutId: ReturnType<typeof setTimeout> | null = null

export const setNotification =
  ( message : string, type: "error" | "success" | "warning" ) =>
    async (dispatch: AppDispatch) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      dispatch(setMessage({ message, type }))

      timeoutId = setTimeout(() => {
        dispatch(setMessage( { message: "", type: null }))
        timeoutId = null
      }, 5000)
    }

export const { setMessage } = messageSlice.actions
export default messageSlice.reducer