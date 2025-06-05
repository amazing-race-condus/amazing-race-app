import React, { createRef } from "react"
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native"
import testStore from "@/store/testStore"
import AddCheckpointForm from "@/components/forms/AddCheckpointForm"
import BottomSheet from "@gorhom/bottom-sheet"
import { Provider } from "react-redux"
import { mockStore } from "@/utils/testUtils"

describe("<AddCheckpointForm />", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders input, radio buttons and add button", async () => {
    const bottomSheetRef = createRef<BottomSheet>()
    const store = testStore()

    render(
      <Provider store={store}>
        <AddCheckpointForm bottomSheetRef={bottomSheetRef} />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Syötä rastin nimi")).toBeTruthy()
      expect(screen.getByText("Lähtö")).toBeTruthy()
      expect(screen.getByText("Välirasti")).toBeTruthy()
      expect(screen.getByText("Maali")).toBeTruthy()
      expect(screen.getByText("Lisää rasti")).toBeTruthy()
    })
  })

  test("calls dispatch after sending the form", async () => {
    const bottomSheetRef = {
      current: { close: null }
    }
    render(
      <Provider store={store}>
        <AddCheckpointForm bottomSheetRef={bottomSheetRef as any} />
      </Provider>
    )

    const input =  await waitFor(() => screen.getByPlaceholderText("Syötä rastin nimi"))
    await act(async () => {
      fireEvent.changeText(input, "Testirasti")
    })
    const radio = await waitFor(() => screen.getByText("Maali"))
    await act(async () => {
      fireEvent.press(radio)
    })

    const button = await waitFor(() => screen.getByText("Lisää rasti"))
    await act(async () => {
      fireEvent.press(button)
    })

    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })
})
