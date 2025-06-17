import React, { createRef } from "react"
import { render, waitFor, act, screen } from "@testing-library/react-native"
import BottomSheet from "@gorhom/bottom-sheet"
import AddEventForm from "../AddEventForm"
import { createMockStore, events } from "@/utils/testUtils"
import { Provider } from "react-redux"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<AddEventForm />", () => {
  let store: any
  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders inputs and add button", async () => {
    const bottomSheetRef = createRef<BottomSheet>()
    const mockSetEvents = jest.fn()
    render(
      <Provider store={store}>
        <AddEventForm bottomSheetRef={bottomSheetRef} events={events} setEvents={mockSetEvents}/>
      </Provider>
    )

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Syötä tapahtuman nimi")).toBeTruthy()
        expect(screen.getByText("Valitse tapahtuman päivämäärä")).toBeTruthy()
        expect(screen.getByText("Lisää tapahtuma")).toBeTruthy()
      })
    })
  })
})