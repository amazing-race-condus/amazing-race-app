import { hintPenalties, skipPenalties, overtimePenalties, createMockStore } from "@/utils/testUtils"
import { Provider } from "react-redux"
import { render, screen, act, fireEvent } from "@testing-library/react-native"
import ListCheckpointPenalties from "../ListGroupCheckpointPenalties"
import { handleAlert } from "@/utils/handleAlert"

jest.mock("@/utils/handleAlert", () => ({
  handleAlert: jest.fn()
}))
jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<ListCheckpointPenalties />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
    ;(handleAlert as jest.Mock).mockReset()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("hint penalties are rendered", () => {
    render(
      <Provider store={store}>
        <ListCheckpointPenalties
          groupId={1}
          usedHints={hintPenalties}
          usedSkip={[]}
          usedOvertime={[]}
        />
      </Provider>
    )

    const hint = screen.getByText(/Vihjepuhelin/)
    expect(hint).toBeTruthy()
  })

  test("overtime penalties are rendered", () => {
    render(
      <Provider store={store}>
        <ListCheckpointPenalties
          groupId={1}
          usedHints={[]}
          usedSkip={[]}
          usedOvertime={overtimePenalties}
        />
      </Provider>
    )

    const overtime = screen.getByText(/Yliaika/)
    expect(overtime).toBeTruthy()
  })

  test("skip penalties are rendered", () => {
    render(
      <Provider store={store}>
        <ListCheckpointPenalties
          groupId={1}
          usedHints={[]}
          usedSkip={skipPenalties}
          usedOvertime={[]}
        />
      </Provider>
    )

    const skip = screen.getByText(/Skip/)
    expect(skip).toBeTruthy()
  })

  test("pressing delete button on hint penalty calls dispatch", async () => {
    render(
      <Provider store={store}>
        <ListCheckpointPenalties
          groupId={1}
          usedHints={hintPenalties}
          usedSkip={[]}
          usedOvertime={[]}
        />
      </Provider>
    )

    const deleteButton = screen.getByTestId("deleteHintButton")
    await act(async () => {
      fireEvent.press(deleteButton)
    })

    expect(handleAlert).toHaveBeenCalledTimes(1)
  })
})