import React, { createRef } from "react"
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native"
import testStore from "@/store/testStore"
import AddGroupForm from "@/components/forms/AddGroupForm"
import BottomSheet from "@gorhom/bottom-sheet"
import { Provider } from "react-redux"
import { mockStore } from "../src/utils/testUtils"

describe("<AddGroupForm />", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders inputs, radio button and add button", async () => {
    const bottomSheetRef = createRef<BottomSheet>()
    const store = testStore()

    render(
      <Provider store={store}>
        <AddGroupForm bottomSheetRef={bottomSheetRef} />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Syötä ryhmän nimi")).toBeTruthy()
      expect(screen.getByPlaceholderText("Syötä jäsenten määrä")).toBeTruthy()
      expect(screen.getByText("Helpotetut vihjeet")).toBeTruthy()
      expect(screen.getByText("Tavalliset vihjeet")).toBeTruthy()
      expect(screen.getByText("Lisää ryhmä")).toBeTruthy()
    })
  })

  test("calls dispatch after sending the form", async () => {
    const bottomSheetRef = {
      current: { close: null }
    }
    render(
      <Provider store={store}>
        <AddGroupForm bottomSheetRef={bottomSheetRef as any} />
      </Provider>
    )

    const input =  await waitFor(() => screen.getByPlaceholderText("Syötä ryhmän nimi"))
    await act(async () => {
      fireEvent.changeText(input, "Testiryhmä")
    })

    const inputMembers =  await waitFor(() => screen.getByPlaceholderText("Syötä jäsenten määrä"))
    await act(async () => {
      fireEvent.changeText(inputMembers, "6")
    })

    const radio = await waitFor(() => screen.getByText("Helpotetut vihjeet"))
    await act(async () => {
      fireEvent.press(radio)
    })

    const button = await waitFor(() => screen.getByText("Lisää ryhmä"))
    await act(async () => {
      fireEvent.press(button)
    })

    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })
})