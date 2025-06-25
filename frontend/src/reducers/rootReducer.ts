import { combineReducers } from "@reduxjs/toolkit"
import user from "./userSlice"
import event from "./eventSlice"
import groups from "./groupSlice"
import checkpoints from "./checkpointsSlice"
import notification from "./notificationSlice"
import allEvents from "./allEventsSlice"

const appReducer = combineReducers({
  user,
  event,
  groups,
  checkpoints,
  notification,
  allEvents
})

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === "RESET") {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer