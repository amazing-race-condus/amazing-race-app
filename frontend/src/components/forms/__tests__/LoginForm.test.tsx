import { render, waitFor, screen, fireEvent } from "@testing-library/react-native"
import { Provider } from "react-redux"
import { createMockStore } from "@/utils/testUtils"
import LoginForm from "../LoginForm"

import { loginUser } from "@/reducers/userSlice"
import { sendResetPasswordMail } from "@/services/authenticationService"

const mockReplace = jest.fn()
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

jest.mock("@/reducers/userSlice", () => ({
  loginUser: jest.fn(),
}))

jest.mock("@/services/authenticationService", () => ({
  sendResetPasswordMail: jest.fn(),
}))

jest.mock("@/utils/handleAlert", () => ({
  handleAlert: jest.fn(({ onConfirm }) => {
    onConfirm()
  })
}))

const mockResetPasswordMail = sendResetPasswordMail as jest.MockedFunction<typeof sendResetPasswordMail>
const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>

describe("<LoginForm />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    )
  }

  describe("Rendering", () => {
    test("renders login form fields and button", () => {
      renderComponent()

      expect(screen.getByText("Kirjaudu sisään:")).toBeTruthy()
      expect(screen.getByText("Salasana:")).toBeTruthy()
      expect(screen.getByText("Kirjaudu sisään")).toBeTruthy()
      expect(screen.getByText("Kirjaudu pääkäyttäjänä")).toBeTruthy()
    })

    test("shows username field and forgot password when admin is checked", async () => {
      renderComponent()

      const adminCheckbox = screen.getByTestId("admin-checkbox")
      fireEvent.press(adminCheckbox)

      expect(screen.getByText("Käyttäjätunnus:")).toBeTruthy()
      expect(screen.getByText("Unohtuiko salasana?")).toBeTruthy()
    })

    test("password field have secure text entry enabled", () => {
      renderComponent()

      const passwordInput = screen.getByTestId("password")
      expect(passwordInput.props.secureTextEntry).toBe(true)
    })
  })

  describe("Successful login", () => {
    test("normal user login works", async () => {
      mockLoginUser.mockReturnValue(jest.fn())
      renderComponent()

      expect(screen.queryByTestId("username")).toBeNull()
      const passwordInput = screen.getByTestId("password")
      const submitButton = screen.getByText("Kirjaudu sisään")

      fireEvent.changeText(passwordInput, "password123")
      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(mockLoginUser).toHaveBeenCalledWith("", "password123", false)
      })
    })

    test("admin user login works", async () => {
      mockLoginUser.mockReturnValue(jest.fn())
      renderComponent()

      const adminCheckbox = screen.getByTestId("admin-checkbox")
      fireEvent.press(adminCheckbox)

      const usernameInput = screen.getByTestId("username")
      const passwordInput = screen.getByTestId("password")
      const submitButton = screen.getByText("Kirjaudu sisään")

      fireEvent.changeText(usernameInput, "admin")
      fireEvent.changeText(passwordInput, "password123")
      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(mockLoginUser).toHaveBeenCalledWith("admin", "password123", true)
      })
    })
  })

  describe("Password reset works", () => {
    test("password email is sent", async () => {
      mockResetPasswordMail.mockResolvedValue(undefined)
      renderComponent()

      const adminCheckbox = screen.getByTestId("admin-checkbox")
      fireEvent.press(adminCheckbox)

      const resetButton = screen.getByText("Unohtuiko salasana?")
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(mockResetPasswordMail).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
      })
    })
  })
})
