import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "@/reducers/rootReducer"

const store = configureStore({
  reducer: rootReducer,
  // ...middleware, devTools, etc.
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store