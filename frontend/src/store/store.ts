import { configureStore } from "@reduxjs/toolkit"
import messageSlice from "../reducers/responseSlice"
import checkpointSlice from "../reducers/checkpointsSlice"

const store = configureStore({
  reducer: {
    message: messageSlice,
    checkpoints: checkpointSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store