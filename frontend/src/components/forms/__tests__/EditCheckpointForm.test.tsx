import React, { createRef } from "react"
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native"
import EditCheckpointForm from "../EditCheckpointForm"
import BottomSheet from "@gorhom/bottom-sheet"
import { Provider } from "react-redux"
import { createMockStore, checkpoint } from "@/utils/testUtils"
import { editCheckpoint } from "@/services/checkpointService"

jest.mock("@/services/checkpointService", () => ({
  editCheckpoint: jest.fn()
}))

describe("<EditCheckpointForm />", () => {
  let store: any
  const setSelectedCheckpoint= jest.fn()
  const bottomSheetRef = createRef<BottomSheet>()

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders correct default falues, radio button and modify button", async () => {

    render(
      <Provider store={store}>
        <EditCheckpointForm bottomSheetRef={bottomSheetRef} checkpoint={checkpoint} setSelectedCheckpoint={setSelectedCheckpoint} />
      </Provider>
    )

    const radio = screen.getByTestId("radio-intermediate")
    expect(radio.props.accessibilityState.checked).toBe(true)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Syötä rastin nimi")).toBeTruthy()
      expect(screen.getByPlaceholderText("Syötä vihjeen URL")).toBeTruthy()
      expect(screen.getByPlaceholderText("Syötä helpotetun vihjeen URL")).toBeTruthy()
      expect(screen.getByDisplayValue("Whatever")).toBeTruthy()
      expect(screen.getByDisplayValue("http://hint.com")).toBeTruthy()
      expect(screen.getByDisplayValue("http://easyhint.com")).toBeTruthy()
      expect(screen.getByText("Muokkaa rastia")).toBeTruthy()
    })
  })

  test("calls dispatch after sending the form", async () => {

    const mockEditCheckpoint = editCheckpoint as jest.Mock
    mockEditCheckpoint.mockResolvedValue({
      id: checkpoint.id,
      name: "Muokataan nimeä",
      type: "INTERMEDIATE",
      hint: "http://hint.com",
      easyHint: "http://easyhint.com"
    })

    render(
      <Provider store={store}>
        <EditCheckpointForm bottomSheetRef={bottomSheetRef} checkpoint={checkpoint} setSelectedCheckpoint={setSelectedCheckpoint} />
      </Provider>
    )

    const button = await waitFor(() => screen.getByText("Muokkaa rastia"))

    await act(async () => {
      fireEvent.press(button)
    })

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
      expect(store.dispatch).toHaveBeenCalledTimes(2)
    })
  })
})