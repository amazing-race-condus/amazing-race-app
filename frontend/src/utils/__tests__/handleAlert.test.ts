import { handleAlert } from "../handleAlert"
import { Alert, Platform } from "react-native"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

const mockConfirm = jest.fn()
Object.defineProperty(window, "confirm", {
  writable: true,
  value: mockConfirm,
})

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: "android",
  },
}))

const mockedAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>

describe("handleAlert util: ", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("on web: ", () => {
    beforeEach(() => {
      Object.defineProperty(Platform, "OS", {
        writable: true,
        value: "web"
      })
    })

    test("should call window.Confirm", () => {
      mockConfirm.mockReturnValue(true)

      handleAlert({
        title: "Test Title",
        message: "Test Message",
        confirmText: "Confirm",
        onConfirm: mockConfirm,
      })

      expect(mockConfirm).toHaveBeenCalledWith("Test Message")
    })

    test("should call onConfirm when confirmed", () => {
      const onConfirmMock = jest.fn()
      mockConfirm.mockReturnValue(true)

      handleAlert({
        title: "Test Title",
        message: "Test Message",
        confirmText: "Confirm",
        onConfirm: onConfirmMock,
      })

      expect(onConfirmMock).toHaveBeenCalledWith()
    })

    test("should not call onConfirm when cancelled", () => {
      const onConfirmMock = jest.fn()
      mockConfirm.mockReturnValue(false)

      handleAlert({
        title: "Test Title",
        message: "Test Message",
        confirmText: "Confirm",
        onConfirm: onConfirmMock,
      })

      expect(onConfirmMock).not.toHaveBeenCalledWith()
    })
  })

  describe("on mobile: ", () => {
    beforeEach(() => {
      Object.defineProperty(Platform, "OS", {
        writable: true,
        value: "android"
      })
    })

    test("should call Alert.alert", () => {
      mockConfirm.mockReturnValue(true)

      handleAlert({
        title: "Test Title",
        message: "Test Message",
        confirmText: "Confirm",
        onConfirm: mockConfirm,
      })

      expect(mockedAlert).toHaveBeenCalledWith(
        "Test Title",
        "Test Message",
        expect.arrayContaining([
          expect.objectContaining({ text: expect.any(String) }),
          expect.objectContaining({ text: "Confirm" })
        ])
      )
    })

    test("should call onConfirm when confirmed", () => {
      const onConfirmMock = jest.fn()

      handleAlert({
        title: "Test Title",
        message: "Test Message",
        confirmText: "Confirm",
        onConfirm: onConfirmMock,
      })

      const alertCall = mockedAlert.mock.calls[0]
      const buttons = alertCall[2] as { onPress?: () => void }[]

      const confirmButton = buttons.find(btn => btn.onPress)
      confirmButton?.onPress?.()

      expect(onConfirmMock).toHaveBeenCalled()
    })

    test("should not call onConfirm when cancelled", () => {
      const onConfirmMock = jest.fn()

      handleAlert({
        title: "Test Title",
        message: "Test Message",
        confirmText: "Confirm",
        onConfirm: onConfirmMock,
      })

      const alertCall = mockedAlert.mock.calls[0]
      const buttons = alertCall[2] as { onPress?: () => void }[]

      const cancelButton = buttons.find(btn => !btn.onPress)
      cancelButton?.onPress?.()

      expect(onConfirmMock).not.toHaveBeenCalled()
    })
  })
})