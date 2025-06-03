import { render, waitFor, fireEvent, screen } from "@testing-library/react-native"
import { Provider } from "react-redux"
import testStore from "@/store/testStore"
import Checkpoints from "@/components/Checkpoints"
import * as expoRouter from "expo-router"
import { Platform, Alert } from "react-native"

jest.useFakeTimers()

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  usePathname: jest.fn(),
}))

jest.mock("@/services/checkpointService", () => ({
  removeCheckpoint: jest.fn().mockResolvedValue(true),
  getAllCheckpoints: jest.fn().mockResolvedValue([
    {
      id: "1",
      name: "Rasti",
    },
  ]),
}))

describe("Rendering checkpoints", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
  it("renders correct header in settings view", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")

    const store = testStore({
      checkpoints: []
    })

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )
    await waitFor(() => {
      expect(getByText("Hallinnoi rasteja:")).toBeTruthy()
    })
  })

  it("renders correct header in checkpoints view", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/checkpoints")

    const store = testStore({
      checkpoints: []
    })

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )
    await waitFor(() => {
      expect(getByText("Rastit:")).toBeTruthy()
    })
  })

  it("renders checkpoint's name and type correctly", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/checkpoints")

    const checkpoints = [
      { id: 1, name: "Rasti A", type: "START" },
      { id: 2, name: "Rasti B", type: "FINISH" },
      { id: 3, name: "Rasti C", type: "INTERMEDIATE" },
    ]

    const store = testStore({
      checkpoints: checkpoints
    })

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )
    await waitFor(() => {
      expect(getByText("Rasti A (Lähtö)")).toBeTruthy()
      expect(getByText("Rasti B (Maali)")).toBeTruthy()
      expect(getByText("Rasti C")).toBeTruthy()
    })
  })
})

describe("Deleting checkpoints", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("shows confirmation window on web platform and dispatches on confirm", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")

    const checkpoint = { id: 1, name: "Rasti A", type: "START" }

    const store = testStore({ checkpoints: [checkpoint] })

    const mockDispatch = jest.fn()
    store.dispatch = mockDispatch

    Object.defineProperty(Platform, "OS", {
      value: "web",
    })

    Object.defineProperty(global, "window", {
      value: { confirm: jest.fn(() => true) },
      writable: true,
    })

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    const button = await waitFor(() => getByText("Poista"))
    fireEvent.press(button)
    expect(mockDispatch).toHaveBeenCalled()

    for (const call of mockDispatch.mock.calls) {
      expect(typeof call[0]).toBe("function")
    }

  })
  it("delete button removes checkpoint when pressed on web platform", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")

    const checkpoint = { id: 1, name: "Rasti A", type: "START" }

    const store = testStore({ checkpoints: [checkpoint] })

    Object.defineProperty(Platform, "OS", {
      value: "web",
    })

    Object.defineProperty(global, "window", {
      value: { confirm: jest.fn(() => true) },
      writable: true,
    })

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    await waitFor(() => {
      expect(getByText("Rasti A (Lähtö)")).toBeTruthy()
    })

    const button = await waitFor(() => getByText("Poista"))
    fireEvent.press(button)

    await waitFor(() => {
      expect(screen.queryByText("Rasti A (Lähtö)")).toBeNull()
    })
  })

  it("shows Alert on native platform and dispatches on confirm", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")

    const checkpoint = { id: 1, name: "Rasti A", type: "START" }

    const store = testStore({ checkpoints: [checkpoint] })

    Object.defineProperty(Platform, "OS", { value: "ios" })

    const alertMock = jest.spyOn(Alert, "alert").mockImplementation(
      (title, message, buttons) => {
        const deleteButton = buttons?.find(b => b.text === "Poista")
        if (deleteButton && deleteButton.onPress) {
          deleteButton.onPress()
        }
      }
    )

    const mockDispatch = jest.fn()
    store.dispatch = mockDispatch

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    const button = getByText("Poista")
    fireEvent.press(button)

    expect(alertMock).toHaveBeenCalled()

    expect(mockDispatch).toHaveBeenCalled()

    alertMock.mockRestore()
  })

  it("delete button removes checkpoint when pressed on native platform", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")

    const checkpoint = { id: 1, name: "Rasti A", type: "START" }

    const store = testStore({ checkpoints: [checkpoint] })

    Object.defineProperty(Platform, "OS", { value: "ios" })

    jest.spyOn(Alert, "alert").mockImplementation(
      (title, message, buttons) => {
        const deleteButton = buttons?.find(b => b.text === "Poista")
        if (deleteButton && deleteButton.onPress) {
          deleteButton.onPress()
        }
      }
    )

    const { getByText } = render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    await waitFor(() => {
      expect(getByText("Rasti A (Lähtö)")).toBeTruthy()
    })

    const button = await waitFor(() => getByText("Poista"))
    fireEvent.press(button)

    await waitFor(() => {
      expect(screen.queryByText("Rasti A (Lähtö)")).toBeNull()
    })
  })
})

