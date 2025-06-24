import { render, fireEvent, act, screen } from "@testing-library/react-native"
import EventItem from "../EventItem"
import { Provider } from "react-redux"
import { events, createMockStore } from "@/utils/testUtils"
import { usePathname } from "expo-router"
import * as alertUtils from "@/utils/handleAlert"

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  usePathname: jest.fn()
}))
jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<EventItem />", () => {
  let store: any
  const setEvents= jest.fn()
  const handleEventChange = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders name, remove button and edit button if user is admin", () => {
    (usePathname as jest.Mock).mockReturnValue("/settings/events")
    store = createMockStore({
      user: {
        id: 1,
        name: "Admin",
        admin: true
      }
    })
    store.dispatch = jest.fn()

    render(
      <Provider store={store}>
        <EventItem
          item={events[0]}
          setEvents={setEvents}
          handleEventChange={handleEventChange}
          events={events}
        />
      </Provider>
    )

    const eventName = screen.getByText(events[0].name)
    const eventDate = screen.getByText("25.06.2025")
    const removeButton = screen.getByText("Poista")
    const editButton = screen.getByText("Muokkaa")
    expect(eventName).toBeTruthy()
    expect(eventDate).toBeTruthy()
    expect(removeButton).toBeTruthy()
    expect(editButton).toBeTruthy()
  })

  test("renders name only if user is not admin", () => {
    (usePathname as jest.Mock).mockReturnValue("/settings/events")
    store = createMockStore({
      user: {
        id: 1,
        name: "User",
        admin: false,
      }
    })
    store.dispatch = jest.fn()

    render(
      <Provider store={store}>
        <EventItem
          item={events[0]}
          setEvents={setEvents}
          handleEventChange={handleEventChange}
          events={events}
        />
      </Provider>
    )

    const groupName = screen.getByText(events[0].name)
    const removeButton = screen.queryByText("Poista")
    const editButton = screen.queryByText("Muokkaa")
    expect(groupName).toBeTruthy()
    expect(removeButton).toBeFalsy()
    expect(editButton).toBeFalsy()
  })

  test("pressing remove button calls handleRemoveEvent", async () => {
    (usePathname as jest.Mock).mockReturnValue("/settings/events")
    const handleAlertMock = jest.spyOn(alertUtils, "handleAlert").mockImplementation(() => {})
    store = createMockStore({
      user: {
        id: 1,
        name: "Admin",
        admin: true
      }
    })
    store.dispatch = jest.fn()

    render(
      <Provider store={store}>
        <EventItem
          item={events[0]}
          setEvents={setEvents}
          handleEventChange={handleEventChange}
          events={events}
        />
      </Provider>
    )

    const removeButton = screen.getByText("Poista")
    await act(async () => {
      fireEvent.press(removeButton)
    })

    expect(handleAlertMock).toHaveBeenCalledTimes(1)
  })
  test("pressing edit button calls onEditEvent", async () => {
    (usePathname as jest.Mock).mockReturnValue("/settings/events")
    const onEditEvent = jest.fn()
    store = createMockStore({
      user: {
        id: 1,
        name: "Admin",
        admin: true
      }
    })
    store.dispatch = jest.fn()

    render(
      <Provider store={store}>
        <EventItem
          item={events[0]}
          setEvents={setEvents}
          handleEventChange={handleEventChange}
          events={events}
          onEditEvent={onEditEvent}
        />
      </Provider>
    )

    const editButton = screen.getByText("Muokkaa")
    await act(async () => {
      fireEvent.press(editButton)
    })

    expect(onEditEvent).toHaveBeenCalledTimes(1)
    expect(onEditEvent).toHaveBeenCalledWith(events[0])
  })
})