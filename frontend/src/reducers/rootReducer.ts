import { combineReducers } from "@reduxjs/toolkit"
import user from "./userSlice"
import event from "./eventSlice"
import groups from "./groupSlice"
import checkpoints from "./checkpointsSlice"
import notification from "./notificationSlice"

// Combine all slice reducers
const appReducer = combineReducers({
  user,
  event,
  groups,
  checkpoints,
  notification,
})

// Optionally handle a RESET action to clear all state
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === "RESET") {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer