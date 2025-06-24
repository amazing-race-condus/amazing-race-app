import React, { createRef } from "react"
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native"
import EditEventForm from "../EditEventForm"
import BottomSheet from "@gorhom/bottom-sheet"
import { Provider } from "react-redux"
import { createMockStore, events } from "@/utils/testUtils"
import { editEvent } from "@/services/eventService"

jest.mock("@/services/eventService", () => ({
  editEvent: jest.fn()
}))

describe("<EditEventForm />", () => {
  let store: any
  const setSelectedEvent= jest.fn()
  const setEvents= jest.fn()
  const bottomSheetRef = createRef<BottomSheet>()

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders correct default falues", async () => {

    render(
      <Provider store={store}>
        <EditEventForm bottomSheetRef={bottomSheetRef} event={events[0]} setSelectedEvent={setSelectedEvent} events={events} setEvents={setEvents}/>
      </Provider>
    )

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Syötä tapahtuman nimi")
      expect(input.props.value).toBe("MockEvent")
      expect(screen.getByText("Valitse tapahtuman päivämäärä")).toBeTruthy()
      expect(screen.getByText("Muokkaa tapahtumaa")).toBeTruthy()
    })
  })

  test("calls dispatch after sending the form", async () => {

    expect(typeof store.dispatch).toBe("function")

    const mockEditEvent = editEvent as jest.Mock
    mockEditEvent.mockResolvedValue({
      id: events[0].id,
      name: "Muokataan nimeä",
      eventDate: new Date()
    })

    render(
      <Provider store={store}>
        <EditEventForm bottomSheetRef={bottomSheetRef} event={events[0]} setSelectedEvent={setSelectedEvent} events={events} setEvents={setEvents}/>
      </Provider>
    )

    const button = await waitFor(() => screen.getByText("Muokkaa tapahtumaa"))

    await act(async () => {
      fireEvent.press(button)
    })

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
      expect(store.dispatch).toHaveBeenCalledTimes(1)
    })
  })
})