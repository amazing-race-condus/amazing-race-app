
import type { AddCheckpoint, Checkpoint} from "@/types"
import { createMockStore } from "@/utils/testUtils"
import checkpointReducer, { addCheckpointReducer, appendCheckpoint, fetchCheckpoints, removeCheckpointReducer, setCheckpoints } from "../checkpointsSlice"
import { createCheckpoint, getAllCheckpoints, removeCheckpoint } from "@/services/checkpointService"

jest.mock("@/services/checkpointService", () => ({
  getAllCheckpoints: jest.fn(),
  removeCheckpoint: jest.fn(),
  createCheckpoint: jest.fn()
}))

describe("checkpointsSlice reducers", () => {
  let store: ReturnType<typeof createMockStore>

  beforeEach(() => {
    store = createMockStore({})
    jest.useFakeTimers()
  })

  const initialState: Checkpoint[] = []

  const returnState: Checkpoint[] = [
    { id: 1, name: "Test Checkpoint", type: "INTERMEDIATE", eventId: 1, hint: null, easyHint: null},
    { id: 2, name: "Another Checkpoint", type: "START", eventId: 1, hint: null, easyHint: null }
  ]

  test("should set checkpoints", () => {
    const state = checkpointReducer(initialState, setCheckpoints(returnState))
    expect(state).toEqual(returnState)
  })

  test("should append checkpoint", () => {
    const newCheckpoint: Checkpoint = returnState[0]
    const state = checkpointReducer(initialState, appendCheckpoint(newCheckpoint))
    expect(state).toEqual([newCheckpoint])
  })

  test("fetchCheckpoints thunk works", async () => {
    (getAllCheckpoints as jest.Mock).mockResolvedValue(returnState)

    await store.dispatch<any>(fetchCheckpoints())

    expect(store.getState().checkpoints).toEqual(returnState)
  })

  test("addCheckpointReducer and removeCheckpointReducer thunks works", async () => {
    const newCheckpoint: AddCheckpoint = {
      name: "Test Checkpoint",
      type: "INTERMEDIATE"
    }
    const mockReturn: Checkpoint = returnState[0]
    ;(createCheckpoint as jest.Mock).mockResolvedValue(mockReturn)
    ;(removeCheckpoint as jest.Mock).mockResolvedValue(undefined)

    await store.dispatch<any>(addCheckpointReducer(newCheckpoint))

    expect(store.getState().checkpoints).toEqual([returnState[0]])

    await store.dispatch<any>(removeCheckpointReducer(1, "Test Checkpoint"))

    expect(store.getState().checkpoints).toEqual([])
  })
})
