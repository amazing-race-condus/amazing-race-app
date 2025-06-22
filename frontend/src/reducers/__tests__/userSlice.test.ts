import userReducer, {
  setUser,
  clearUser,
  loginUser,
  logoutUser,
  loadUserFromStorage,
} from "@/reducers/userSlice"
import type { Group, Penalty, User } from "@/types"
import { createMockStore } from "@/utils/testUtils"
import { storageUtil } from "@/utils/storageUtil"
import * as authenticationService from "@/services/authenticationService"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

jest.mock("@/services/authenticationService", () => ({
  login: jest.fn(),
}))

jest.mock("@/reducers/notificationSlice", () => ({
  setNotification: jest.fn(() => ({ type: "notification/setNotification" })),
}))

describe("userSlice reducers", () => {
  let store: ReturnType<typeof createMockStore>
  const initialState: User = {
    id: 0,
    token: "",
    username: "",
    admin: false,
  }

  const mockUser: User = {
    id: 1,
    token: "token123",
    username: "testuser",
    admin: true,
  }

  beforeEach(() => {
    store = createMockStore({})
    jest.clearAllMocks()
  })

  test("should set user", () => {
    const state = userReducer(initialState, setUser(mockUser))
    expect(state).toEqual(mockUser)
  })

  test("should clear user", () => {
    const state = userReducer(initialState, clearUser())
    expect(state).toEqual(initialState)
  })

  test("loginUser thunk success", async () => {
    (authenticationService.login as jest.Mock).mockResolvedValue(mockUser)
    ;(storageUtil.setUser as jest.Mock).mockResolvedValue(undefined)

    await store.dispatch<any>(loginUser("testuser", "password", true))
    const state = store.getState().user
    expect(state).toEqual(mockUser)
    expect(storageUtil.setUser).toHaveBeenCalledWith(mockUser)
  })

  test("loginUser thunk success", async () => {
    (authenticationService.login as jest.Mock).mockResolvedValue(mockUser)
    ;(storageUtil.setUser as jest.Mock).mockResolvedValue(undefined)

    await store.dispatch<any>(loginUser("testuser", "password", true))
    const state = store.getState().user
    expect(state).toEqual(mockUser)
    expect(storageUtil.setUser).toHaveBeenCalledWith(mockUser)
  })

  test("loginUser thunk failure", async () => {
    (authenticationService.login as jest.Mock).mockRejectedValue(new Error("failed"))
    await store.dispatch<any>(loginUser("testuser", "wrong", true))
    const state = store.getState().user
    expect(state).toEqual(initialState)
    expect(storageUtil.setUser).not.toHaveBeenCalledWith(mockUser)
  })

  test("logoutUser thunk", async () => {
    (storageUtil.removeUser as jest.Mock).mockResolvedValue(undefined)
    await store.dispatch<any>(logoutUser())
    const state = store.getState().user
    expect(state).toEqual(initialState)
    expect(storageUtil.removeUser).toHaveBeenCalledTimes(1)
  })

  test("loadUserFromStorage thunk with user", async () => {
    (storageUtil.getUser as jest.Mock).mockResolvedValue(mockUser)
    await store.dispatch<any>(loadUserFromStorage())
    const state = store.getState().user
    expect(state).toEqual(mockUser)
    expect(storageUtil.setUser).not.toHaveBeenCalledWith(mockUser)
  })

  test("loadUserFromStorage thunk with no user", async () => {
    (storageUtil.getUser as jest.Mock).mockResolvedValue(null)
    await store.dispatch<any>(loadUserFromStorage())
    const state = store.getState().user
    expect(state).toEqual(initialState)
    expect(storageUtil.setUser).not.toHaveBeenCalledWith(mockUser)
  })
})