import { Provider } from "react-redux"
import { render, screen, fireEvent } from "@testing-library/react-native"
import GroupCheckpointItem from "@/components/groups/GroupCheckpointItem"
import { group, checkpoint, createMockStore } from "@/utils/testUtils"

describe("<GroupCheckpointItem />", () => {
  let store: any
  let mockCompleteCheckpoint: any
  let mockOpenHint: any

  beforeEach(() => {
    store = createMockStore()
    store.dispatch = jest.fn()
    mockCompleteCheckpoint = jest.fn()
    mockOpenHint = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("is expanded when active", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointItem
          group={group}
          checkpoint={checkpoint}
          nextCheckpointId={checkpoint.id}
          completeCheckpoint={mockCompleteCheckpoint}
          openHint={mockOpenHint}
        />
      </Provider>
    )

    const skipButton = screen.getByText("Skip")
    expect(skipButton).toBeDefined()
  })

  test("hintphone dispatches to store when pressed", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointItem
          group={group}
          checkpoint={checkpoint}
          nextCheckpointId={checkpoint.id}
          completeCheckpoint={mockCompleteCheckpoint}
          openHint={mockOpenHint}
        />
      </Provider>
    )

    const hintButton = screen.getByText("Vihjepuhelin")
    fireEvent.press(hintButton)

    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })

  test("skip dispatches to store when pressed", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointItem
          group={group}
          checkpoint={checkpoint}
          nextCheckpointId={checkpoint.id}
          completeCheckpoint={mockCompleteCheckpoint}
          openHint={mockOpenHint}
        />
      </Provider>
    )

    const skipButton = screen.getByText("Skip")
    fireEvent.press(skipButton)

    expect(mockCompleteCheckpoint).toHaveBeenCalledTimes(1)
  })

  test("overtime calls completeCheckpoint when pressed", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointItem
          group={group}
          checkpoint={checkpoint}
          nextCheckpointId={checkpoint.id}
          completeCheckpoint={mockCompleteCheckpoint}
          openHint={mockOpenHint}
        />
      </Provider>
    )

    const overtimeButton = screen.getByText("Yliaika")
    fireEvent.press(overtimeButton)

    expect(mockCompleteCheckpoint).toHaveBeenCalledTimes(1)
  })
})
