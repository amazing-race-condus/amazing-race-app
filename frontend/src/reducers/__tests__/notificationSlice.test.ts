import notificationReducer, { setMessage, setNotification } from "../notificationSlice"
import type { Notification } from "@/types"
import { createMockStore } from "@/utils/testUtils"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("notificationSlice reducers", () => {
  let store : ReturnType<typeof createMockStore>

  const initialState: Notification = {
    message: "",
    type: null
  }

  beforeEach(() => {
    store = createMockStore({})
    jest.useFakeTimers()
  })

  test("should set notification", () => {
    const note = { message: "Test notification", type: null }
    const state = notificationReducer(initialState, setMessage(note))
    expect(state).toEqual(note)
  })

  test("setNotification thunk works", async () => {
    await store.dispatch<any>(setNotification("Hello", "success"))
    expect(store.getState().notification).toEqual({ message: "Hello", type: "success" })

    jest.runAllTimers()
    expect(store.getState().notification).toEqual({ message: "", type: null })
    jest.useRealTimers()
  })
})