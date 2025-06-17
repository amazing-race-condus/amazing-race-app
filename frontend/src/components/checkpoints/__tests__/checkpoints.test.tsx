import { render, waitFor, fireEvent, screen } from "@testing-library/react-native"
import { Provider } from "react-redux"
import testStore from "@/store/testStore"
import Checkpoints from "@/components/checkpoints/Checkpoints"
import * as expoRouter from "expo-router"
import { Platform, Alert } from "react-native"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

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

describe("<Checkpoints />", () => {

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test("renders correct header in settings view", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")

    const store = testStore({
      checkpoints: []
    })
    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByText("Hallinnoi rasteja:")).toBeTruthy()
    })
  })

  test("renders correct header in checkpoints view", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/checkpoints")

    const store = testStore({
      checkpoints: []
    })
    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByText("Rastit")).toBeTruthy()
    })
  })

  test("renders checkpoint's name and type correctly", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/checkpoints")

    const checkpoints = [
      { id: 1, name: "Rasti A", type: "START" },
      { id: 2, name: "Rasti B", type: "FINISH" },
      { id: 3, name: "Rasti C", type: "INTERMEDIATE" },
    ]

    const store = testStore({
      checkpoints: checkpoints
    })

    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByText("Rasti A (Lähtö)")).toBeTruthy()
      expect(screen.getByText("Rasti B (Maali)")).toBeTruthy()
      expect(screen.getByText("Rasti C")).toBeTruthy()
    })
  })

  test("pressing delete button shows confirmation window on web platform and dispatches on confirm", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/checkpoints")
    const checkpoint = { id: 1, name: "Rasti A", type: "START" }

    const store = testStore({ checkpoints: [checkpoint] })

    store.dispatch = jest.fn()

    Object.defineProperty(Platform, "OS", {
      value: "web",
    })

    Object.defineProperty(global, "window", {
      value: { confirm: jest.fn(() => true) },
      writable: true,
    })

    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    const button = await waitFor(() => screen.getByText("Poista"))
    fireEvent.press(button)
    expect(store.dispatch).toHaveBeenCalled()

  })
  test("delete button removes checkpoint when pressed on web platform", async () => {
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

    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Rasti A (Lähtö)")).toBeTruthy()
    })

    const button = await waitFor(() => screen.getByText("Poista"))
    fireEvent.press(button)

    await waitFor(() => {
      expect(screen.queryByText("Rasti A (Lähtö)")).toBeNull()
    })
  })

  test("pressing delete button shows Alert on native platform and dispatches on confirm", async () => {
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
    store.dispatch = jest.fn()

    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    const button = screen.getByText("Poista")
    fireEvent.press(button)

    expect(alertMock).toHaveBeenCalled()

    expect(store.dispatch).toHaveBeenCalled()

    alertMock.mockRestore()
  })

  test("delete button removes checkpoint when pressed on native platform", async () => {
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

    render(
      <Provider store={store}>
        <Checkpoints />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Rasti A (Lähtö)")).toBeTruthy()
    })

    const button = await waitFor(() => screen.getByText("Poista"))
    fireEvent.press(button)

    await waitFor(() => {
      expect(screen.queryByText("Rasti A (Lähtö)")).toBeNull()
    })
  })
})

