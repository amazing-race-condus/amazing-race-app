import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'auth',
  initialState: "",
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      return action.payload
    }
  },
})

export const { setMessage } = messageSlice.actions
export default messageSlice.reducer