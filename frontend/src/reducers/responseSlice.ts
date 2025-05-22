import { AppDispatch } from "@/store/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { NotificationState } from "@/types"

const initialState: NotificationState = {
  message: "",
  type: null
}

const messageSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<NotificationState>) {
      return action.payload
    }
  },
})

export const setNotification =
  ( message : string, type: "error" | "success" ) =>
    async (dispatch: AppDispatch) => {
      dispatch(setMessage({ message, type }))

      setTimeout(() => {
        dispatch(setMessage( { message: "", type: null }))
      }, 5000)
    }

export const { setMessage } = messageSlice.actions
export default messageSlice.reducer