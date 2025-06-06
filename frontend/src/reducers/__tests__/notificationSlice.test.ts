import groupReducer, { setMessage } from "../notificationSlice"
import type { Notification } from "@/types"

describe("groupSlice reducers", () => {
  const initialState: Notification = {
    message: "",
    type: null
  }

  test("should set notification", () => {
    const note = { message: "Test notification", type: null }
    const state = groupReducer(initialState, setMessage(note))
    expect(state).toEqual(note)
  })
})