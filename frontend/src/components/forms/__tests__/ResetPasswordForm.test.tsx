import { render, waitFor, screen, fireEvent } from "@testing-library/react-native"
import { Provider } from "react-redux"
import { createMockStore } from "@/utils/testUtils"
import ResetPasswordForm from "../ResetPasswordForm"
import { resetPassword } from "@/services/authenticationService"

jest.mock("@/services/authenticationService", () => ({
  resetPassword: jest.fn(),
}))

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

const mockResetPassword = resetPassword as jest.MockedFunction<typeof resetPassword>

describe("<ResetPasswordForm />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <ResetPasswordForm />
      </Provider>
    )
  }

  describe("Rendering", () => {
    test("renders all form elements correctly", () => {
      renderComponent()

      expect(screen.getByTestId("new-password")).toBeTruthy()
      expect(screen.getByTestId("new-password-confirm")).toBeTruthy()
      expect(screen.getByText("Vaihda salasana:")).toBeTruthy()
      expect(screen.getByText("Anna uusi salasana:")).toBeTruthy()
      expect(screen.getByText("Anna salasana uudelleen:")).toBeTruthy()
      expect(screen.getByText("Vaihda salasana")).toBeTruthy()
    })

    test("password fields have secure text entry enabled", () => {
      renderComponent()

      const passwordInput = screen.getByTestId("new-password")
      const confirmPasswordInput = screen.getByTestId("new-password-confirm")

      expect(passwordInput.props.secureTextEntry).toBe(true)
      expect(confirmPasswordInput.props.secureTextEntry).toBe(true)
    })
  })

  describe("Form Validation", () => {
    test("shows error when passwords don't match", async () => {
      renderComponent()

      const passwordInput = screen.getByTestId("new-password")
      const confirmPasswordInput = screen.getByTestId("new-password-confirm")
      const submitButton = screen.getByText("Vaihda salasana")

      fireEvent.changeText(passwordInput, "password123")
      fireEvent.changeText(confirmPasswordInput, "differentPassword")
      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
      })

      expect(passwordInput.props.value).toBe("")
      expect(confirmPasswordInput.props.value).toBe("")
    })

    test("clears form fields after validation error", async () => {
      renderComponent()

      const passwordInput = screen.getByTestId("new-password")
      const confirmPasswordInput = screen.getByTestId("new-password-confirm")
      const submitButton = screen.getByText("Vaihda salasana")

      fireEvent.changeText(passwordInput, "password123")
      fireEvent.changeText(confirmPasswordInput, "different")
      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(passwordInput.props.value).toBe("")
        expect(confirmPasswordInput.props.value).toBe("")
      })
    })
  })

  describe("Successful Password Reset", () => {
    test("handles successful password reset", async () => {
      mockResetPassword.mockResolvedValueOnce(undefined)
      renderComponent()

      const passwordInput = screen.getByTestId("new-password")
      const confirmPasswordInput = screen.getByTestId("new-password-confirm")
      const submitButton = screen.getByText("Vaihda salasana")

      fireEvent.changeText(passwordInput, "password123")
      fireEvent.changeText(confirmPasswordInput, "password123")
      fireEvent.press(submitButton)

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith("password123", undefined)
        expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
      })

      expect(passwordInput.props.value).toBe("")
      expect(confirmPasswordInput.props.value).toBe("")
    })
  })

  describe("User Interactions", () => {
    test("submits form when return key is pressed on confirm password field", async () => {
      mockResetPassword.mockResolvedValueOnce(undefined)
      renderComponent()

      const passwordInput = screen.getByTestId("new-password")
      const confirmPasswordInput = screen.getByTestId("new-password-confirm")

      fireEvent.changeText(passwordInput, "password123")
      fireEvent.changeText(confirmPasswordInput, "password123")
      fireEvent(confirmPasswordInput, "submitEditing")

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith("password123", undefined)
      })
    })
  })
})