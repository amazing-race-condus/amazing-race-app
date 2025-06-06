import notificationReducer, { setMessage, setNotification } from "../notificationSlice"
import { configureStore } from "@reduxjs/toolkit"
import type { Notification } from "@/types"

describe("notificationSlice reducers", () => {
  // let store

  // beforeAll(() => {
  //   jest.useFakeTimers()
  //   store = configureStore({
  //     reducer: {
  //       notification: notificationReducer,
  //     },
  //   })
  // })
  const initialState: Notification = {
    message: "",
    type: null
  }

  test("should set notification", () => {
    const note = { message: "Test notification", type: null }
    const state = notificationReducer(initialState, setMessage(note))
    expect(state).toEqual(note)
  })

  test("setNotification thunk works", async () => {
    jest.useFakeTimers()
    const store = configureStore({
      reducer: {
        notification: notificationReducer,
      },
    })

    await store.dispatch<any>(setNotification("Hello", "success"))
    expect(store.getState().notification).toEqual({ message: "Hello", type: "success" })

    jest.runAllTimers()
    expect(store.getState().notification).toEqual({ message: "", type: null })
    jest.useRealTimers()
  })
})