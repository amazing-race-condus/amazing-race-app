import { AppDispatch } from "@/store/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const messageSlice = createSlice({
  name: "auth",
  initialState: "",
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      return action.payload
    }
  },
})

export const setNotification = ( message : string) => async (dispatch: AppDispatch) => {
  dispatch(setMessage(message))

  setTimeout(() => {
    dispatch(setMessage(""))
  }, 5000)
}

export const { setMessage } = messageSlice.actions
export default messageSlice.reducer