import { configureStore } from "@reduxjs/toolkit"
import messageSlice from "../reducers/responseSlice"
import checkpointSlice from "../reducers/checkpointsSlice"
import groupSlice from "../reducers/groupSlice"

const store = configureStore({
  reducer: {
    message: messageSlice,
    checkpoints: checkpointSlice,
    groups: groupSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store