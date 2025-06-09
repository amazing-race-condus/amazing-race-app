import React, { createRef } from "react"
import { render, fireEvent, waitFor, act, screen } from "@testing-library/react-native"
import EditGroupForm from "@/components/forms/EditGroupForm"
import BottomSheet from "@gorhom/bottom-sheet"
import { Provider } from "react-redux"
import { createMockStore, group } from "@/utils/testUtils"
import { editGroup } from "@/services/groupService"

jest.mock("@/services/groupService", () => ({
  editGroup: jest.fn()
}))

describe("<EditGroupForm />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders correct default falues, radio button and modify button", async () => {
    const bottomSheetRef = createRef<BottomSheet>()

    render(
      <Provider store={store}>
        <EditGroupForm bottomSheetRef={bottomSheetRef} group={group} />
      </Provider>
    )

    const radio = screen.getByTestId("radio-normal")
    expect(radio.props.accessibilityState.checked).toBe(true)

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Syötä ryhmän nimi")).toBeTruthy()
      expect(screen.getByPlaceholderText("Syötä jäsenten määrä")).toBeTruthy()
      expect(screen.getByDisplayValue("Testers")).toBeTruthy()
      expect(screen.getByDisplayValue("5")).toBeTruthy()
      expect(screen.getByText("Muokkaa ryhmää")).toBeTruthy()
    })
  })

  test("calls dispatch after sending the form", async () => {
    const bottomSheetRef = {
      current: { close: null }
    }

    const mockEditGroup = editGroup as jest.Mock
    mockEditGroup.mockResolvedValue({
      id: group.id,
      name: "Muokataan nimeä",
      members: 6,
      easy: false
    })

    render(
      <Provider store={store}>
        <EditGroupForm bottomSheetRef={bottomSheetRef as any} group={group} />
      </Provider>
    )

    const button = await waitFor(() => screen.getByText("Muokkaa ryhmää"))

    await act(async () => {
      fireEvent.press(button)
    })

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
      expect(store.dispatch).toHaveBeenCalledTimes(2)
    })
  })
})