import { render, fireEvent, act, screen } from "@testing-library/react-native"
import GroupCheckpointActions from "../GroupCheckpointActions"
import { Provider } from "react-redux"
import { group, checkpoint, startCheckpoint, createMockStore } from "@/utils/testUtils"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<GroupCheckpointActions />", () => {
  let store: any
  let mockCompleteCheckpoint: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
    mockCompleteCheckpoint = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders all buttons for intermediate checkpoint", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointActions
          checkpoint={checkpoint}
          group={group}
          usedHints={[]}
          completeCheckpoint={mockCompleteCheckpoint}
        />
      </Provider>
    )

    const buttons = []
    buttons.push(screen.getByText("Skip"))
    buttons.push(screen.getByText("Suorita"))
    buttons.push(screen.getByText("Vihjepuhelin"))
    buttons.push(screen.getByText("Yliaika"))

    for (const button of buttons) {
      expect(button).toBeTruthy()
    }
  })

  test("renders start button for start checkpoint", () => {
    render(
      <Provider store={store}>
        <GroupCheckpointActions
          checkpoint={startCheckpoint}
          group={group}
          usedHints={[]}
          completeCheckpoint={mockCompleteCheckpoint}
        />
      </Provider>
    )

    const startButton = screen.getByText("Aloita")

    expect(startButton).toBeTruthy()
  })

  test("pressing penalty buttons calls dispatch or completeCheckpoint as required", async () => {
    render(
      <Provider store={store}>
        <GroupCheckpointActions
          checkpoint={checkpoint}
          group={group}
          usedHints={[]}
          completeCheckpoint={mockCompleteCheckpoint}
        />
      </Provider>
    )

    const buttons = []
    buttons.push(screen.getByText("Skip"))
    buttons.push(screen.getByText("Vihjepuhelin"))
    buttons.push(screen.getByText("Yliaika"))

    for (const button of buttons) {
      await act(async () => {
        fireEvent.press(button)
      })
    }

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(mockCompleteCheckpoint).toHaveBeenCalledTimes(2)
  })

  test("pressing complete button calls completeCheckpoint", async () => {
    render(
      <Provider store={store}>
        <GroupCheckpointActions
          checkpoint={checkpoint}
          group={group}
          usedHints={[]}
          completeCheckpoint={mockCompleteCheckpoint}
        />
      </Provider>
    )

    const completeButton = screen.getByText("Suorita")

    await act(async () => {
      fireEvent.press(completeButton)
    })

    expect(mockCompleteCheckpoint).toHaveBeenCalledTimes(1)
  })
})