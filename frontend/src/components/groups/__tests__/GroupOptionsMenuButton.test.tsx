import { render, screen } from "@testing-library/react-native"
import GroupOptionsMenuButton from "../GroupOptionsMenuButton"
import { Provider } from "react-redux"
import { createMockStore } from "@/utils/testUtils"
import { createRef } from "react"
import BottomSheet from "@gorhom/bottom-sheet"

describe("<GroupOptionsMenuButton />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("button renders correctly", () => {
    const bottomSheetRef = createRef<BottomSheet>()
    render(
      <Provider store={store}>
        <GroupOptionsMenuButton ref={bottomSheetRef} />
      </Provider>
    )

    const optionButton = screen.getByTestId("optionButton")
    expect(optionButton).toBeTruthy()
  })
})
