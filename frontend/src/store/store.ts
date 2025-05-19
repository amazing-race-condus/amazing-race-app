import { configureStore } from "@reduxjs/toolkit"
import messageSlice from "../reducers/responseSlice"

const store = configureStore({
  reducer: {
    message: messageSlice
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store