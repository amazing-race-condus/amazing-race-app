import { render, screen, fireEvent, waitFor } from "@testing-library/react-native"
import Logout from "../Logout"
import { Provider } from "react-redux"
import { createMockStore } from "@/utils/testUtils"
import { storageUtil } from "@/utils/storageUtil"
import { logoutUser } from "@/reducers/userSlice"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
    removeEventId: jest.fn(),
  },
}))

jest.mock("@/reducers/userSlice", () => ({
  logoutUser: jest.fn(() => ({ type: "user/logoutUser" })),
}))

describe("<Logout />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Logout />
      </Provider>
    )
  }

  test("renders logout button with correct text", () => {
    renderComponent()
    expect(screen.getByText("Kirjaudu ulos")).toBeTruthy()
  })

  test("calls removeEventId and dispatches logoutUser on press", async () => {
    renderComponent()
    const button = screen.getByText("Kirjaudu ulos")
    fireEvent.press(button)

    await waitFor(() => {
      expect(storageUtil.removeEventId).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(logoutUser())
    })
  })
})