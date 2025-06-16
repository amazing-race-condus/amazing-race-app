import { render, fireEvent, act, screen } from "@testing-library/react-native"
import GroupCheckpointHeader from "../GroupCheckpointHeader"
import { Provider } from "react-redux"
import { checkpoint, startCheckpoint, finishCheckpoint, createMockStore } from "@/utils/testUtils"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<GroupCheckpointHeader />", () => {
  let store: any
  let mockOpenHint: any
  let mockToggleExpanded: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
    mockOpenHint = jest.fn()
    mockToggleExpanded = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders checkpoint name and hint button for intermediate checkpoint when active", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointHeader
          checkpoint={checkpoint}
          isActive={true}
          isExpanded={true}
          openHint={mockOpenHint}
          toggleExpanded={mockToggleExpanded}
        />
      </Provider>
    )

    const checkpointName = screen.getByText(checkpoint.name)
    const hintButton = screen.getByText("Vihje")
    expect(checkpointName).toBeTruthy()
    expect(hintButton).toBeTruthy()
  })

  test("pressing hint button calls openHint function", async () => {
    render(
      <Provider store={store}>
        <GroupCheckpointHeader
          checkpoint={checkpoint}
          isActive={true}
          isExpanded={true}
          openHint={mockOpenHint}
          toggleExpanded={mockToggleExpanded}
        />
      </Provider>
    )

    const hintButton = screen.getByText("Vihje")
    await act(async () => {
      fireEvent.press(hintButton)
    })

    expect(mockOpenHint).toHaveBeenCalledTimes(1)
  })

  test("pressing checkpoint name box calls toggleExpanded", async () => {
    render(
      <Provider store={store}>
        <GroupCheckpointHeader
          checkpoint={checkpoint}
          isActive={false}
          isExpanded={false}
          openHint={mockOpenHint}
          toggleExpanded={mockToggleExpanded}
        />
      </Provider>
    )

    const checkpointNameBox = screen.getByText(checkpoint.name)
    await act(async () => {
      fireEvent.press(checkpointNameBox)
    })

    expect(mockToggleExpanded).toHaveBeenCalledTimes(1)
  })

  test("renders checkpoint name and type for start checkpoint when active", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointHeader
          checkpoint={startCheckpoint}
          isActive={true}
          isExpanded={true}
          openHint={mockOpenHint}
          toggleExpanded={mockToggleExpanded}
        />
      </Provider>
    )

    const checkpointName = screen.getByText(startCheckpoint.name)
    const checkpointType = screen.getByText("Lähtö")
    expect(checkpointName).toBeTruthy()
    expect(checkpointType).toBeTruthy()
  })

  test("renders checkpoint name and type for start when inactive", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointHeader
          checkpoint={startCheckpoint}
          isActive={false}
          isExpanded={false}
          openHint={mockOpenHint}
          toggleExpanded={mockToggleExpanded}
        />
      </Provider>
    )

    const checkpointName = screen.getByText(startCheckpoint.name)
    const checkpointType = screen.getByText("Lähtö")
    expect(checkpointName).toBeTruthy()
    expect(checkpointType).toBeTruthy()
  })

  test("renders checkpoint name and type for finish checkpoint", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointHeader
          checkpoint={finishCheckpoint}
          isActive={true}
          isExpanded={true}
          openHint={mockOpenHint}
          toggleExpanded={mockToggleExpanded}
        />
      </Provider>
    )

    const checkpointName = screen.getByText(finishCheckpoint.name)
    const checkpointType = screen.getByText("Maali")
    expect(checkpointName).toBeTruthy()
    expect(checkpointType).toBeTruthy()
  })
})