import { configureStore } from "@reduxjs/toolkit"
import messageSlice from "../reducers/notificationSlice"
import checkpointSlice from "../reducers/checkpointsSlice"
import groupSlice from "../reducers/groupSlice"
import eventSlice from "../reducers/eventSlice"
import userSlice from "../reducers/userSlice"

const store = configureStore({
  reducer: {
    message: messageSlice,
    checkpoints: checkpointSlice,
    groups: groupSlice,
    event: eventSlice,
    user: userSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store