import { render, waitFor, fireEvent, screen } from "@testing-library/react-native"
import { Provider } from "react-redux"
import testStore from "@/store/testStore"
import Groups from "@/components/groups/Groups"
import * as expoRouter from "expo-router"
import { Platform, Alert } from "react-native"

jest.useFakeTimers()

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  usePathname: jest.fn(),
  useFocusEffect: jest.fn((fn) => fn())
}))

jest.mock("@/services/groupService", () => ({
  removeGroup: jest.fn().mockResolvedValue(true),
  getAllGroups: jest.fn().mockResolvedValue([
    {
      id: "1",
      name: "Ryhmä",
    },
  ]),
}))

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<Groups />", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
  test("renders search bar and correct header in settings view", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/groups")

    const store = testStore({
      groups: [],
      event: {
        id: 1,
        name: "eventti",
        startTime: null,
        endTime: null,
        minRouteTime: null,
        maxRouteTime: null,
        eventDate: null,
        group: [],
        checkpoints: [],
        penalties: []
      }
    })

    render(
      <Provider store={store}>
        <Groups />
      </Provider>
    )
    const textInput = screen.getByPlaceholderText("Hae ryhmiä...")
    expect(textInput).toBeTruthy()
    await waitFor(() => {
      expect(screen.getByText("Hallinnoi ryhmiä eventti")).toBeTruthy()
    })

  })

  test("renders search bar, filter bar and correct header in groups view", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/")

    const store = testStore({
      groups: [],
      event : {
        id:1,
        name: "eventti"
      }
    })

    render(
      <Provider store={store}>
        <Groups />
      </Provider>
    )
    const textInput = screen.getByPlaceholderText("Hae ryhmiä...")
    expect(textInput).toBeTruthy()
    await waitFor(() => {
      expect(screen.getByText("eventti | Ryhmät")).toBeTruthy()
    })

    const segmentedControl = screen.getByTestId("RNCSegmentedControl")
    expect(segmentedControl.props.values).toContain("Aakkosjärjestys")
    expect(segmentedControl.props.values).toContain("Aika")
    expect(segmentedControl.props.values).toContain("Status")
  })

  test("renders group's name correctly", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/")

    const groups = [
      { id: 1, name: "Ryhmä A" },
      { id: 2, name: "Ryhmä B" }
    ]

    const store = testStore({
      groups: groups,
    })

    render(
      <Provider store={store}>
        <Groups />
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByText("Ryhmä A")).toBeTruthy()
      expect(screen.getByText("Ryhmä B")).toBeTruthy()
    })
  })

  test("pressing delete button shows confirmation window on web platform and dispatches on confirm", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/groups")

    const group = { id: 1, name: "Rasti A", type: "START" }

    const store = testStore({ groups: [group] })

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
        <Groups />
      </Provider>
    )

    const button = await waitFor(() => screen.getByText("Poista"))
    fireEvent.press(button)
    expect(store.dispatch).toHaveBeenCalled()

  })
  test("delete button removes group when pressed on web platform", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/groups")

    const group = { id: 1, name: "Ryhmä A"}

    const store = testStore({ groups: [group] })

    Object.defineProperty(Platform, "OS", {
      value: "web",
    })

    Object.defineProperty(global, "window", {
      value: { confirm: jest.fn(() => true) },
      writable: true,
    })

    const { getByText } = render(
      <Provider store={store}>
        <Groups />
      </Provider>
    )

    await waitFor(() => {
      expect(getByText("Ryhmä A")).toBeTruthy()
    })

    const button = await waitFor(() => getByText("Poista"))
    fireEvent.press(button)

    await waitFor(() => {
      expect(screen.queryByText("Ryhmä A")).toBeNull()
    })
  })

  test("pressing delete button shows Alert on native platform and dispatches on confirm", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/groups")

    const group = { id: 1, name: "Ryhmä A"}

    const store = testStore({ groups: [group] })

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

    const { getByText } = render(
      <Provider store={store}>
        <Groups />
      </Provider>
    )

    const button = getByText("Poista")
    fireEvent.press(button)

    expect(alertMock).toHaveBeenCalled()

    expect(store.dispatch).toHaveBeenCalled()

    alertMock.mockRestore()
  })

  test("delete button removes group when pressed on native platform", async () => {
    (expoRouter.usePathname as jest.Mock).mockReturnValue("/settings/groups")

    const group = { id: 1, name: "Ryhmä A"}

    const store = testStore({ groups: [group] })

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
        <Groups />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText("Ryhmä A")).toBeTruthy()
    })

    const button = await waitFor(() => screen.getByText("Poista"))
    fireEvent.press(button)

    await waitFor(() => {
      expect(screen.queryByText("Ryhmä A")).toBeNull()
    })
  })
})

