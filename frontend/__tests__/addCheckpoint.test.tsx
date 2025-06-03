import React, { createRef } from "react"
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native"
import * as reactRedux from "react-redux"
import testStore from "@/store/testStore"
import AddCheckpointForm from "@/components/AddCheckpointForm"
import BottomSheet from "@gorhom/bottom-sheet"
import { Provider } from "react-redux"

jest.mock("@/services/checkpointService", () => ({
  createCheckpoint: jest.fn().mockResolvedValue({
    id: "99",
    name: "Testirasti",
    type: "FINISH",
    hint: null,
    eventId: null,
  }),
  getAllCheckpoints: jest.fn().mockResolvedValue([]),
  removeCheckpoint: jest.fn().mockResolvedValue(true),
}))

describe("AddCheckpointForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("renders input, radio buttons and add button", async () => {
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

  it("kutsuu dispatchia ja sulkee bottomsheetin, kun lomake lähetetään", async () => {
    const mockDispatch = jest.fn()
    jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch)

    const bottomSheetRef = {
      current: { close: null }
    }

    const store = testStore()

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

    await waitFor(() => {
      expect(mockDispatch.mock.calls).toHaveLength(1)
    })
  })
})
