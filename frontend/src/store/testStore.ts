import { configureStore } from "@reduxjs/toolkit"
import messageSlice from "../reducers/notificationSlice"
import checkpointSlice from "../reducers/checkpointsSlice"
import groupSlice from "../reducers/groupSlice"
import eventSlice from "@/reducers/eventSlice"

const testStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      message: messageSlice,
      checkpoints: checkpointSlice,
      groups: groupSlice,
      event: eventSlice,
    },
    preloadedState,
  })

export default testStore