import groupReducer, { setGroups, appendGroup, updateGroup, fetchGroups, givePenaltyReducer, removePenaltyReducer, addGroupReducer, removeGroupReducer, dnfGroupReducer, giveNextCheckpointReducer } from "../groupSlice"
import type { Group, Penalty } from "@/types"
import { createMockStore } from "@/utils/testUtils"
import { givePenalty, removePenalty } from "@/services/penaltyService"
import { createGroup, dnfGroup, getAllGroups, giveNextCheckpoint, removeGroup } from "@/services/groupService"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

jest.mock("@/services/groupService", () => ({
  getAllGroups: jest.fn(),
  createGroup: jest.fn(),
  removeGroup: jest.fn(),
  dnfGroup: jest.fn(),
  giveNextCheckpoint: jest.fn()
}))

jest.mock("@/services/penaltyService", () => ({
  removePenalty: jest.fn(),
  givePenalty: jest.fn()
}))

describe("groupSlice reducers", () => {
  let store: ReturnType<typeof createMockStore>
  const initialState: Group[] = []

  beforeEach(() => {
    store = createMockStore({})
    jest.useFakeTimers()
  })

  const returnGroups: Group[] = [
    { id: 1, name: "Group 1", penalty: [], disqualified: false, route: [], nextCheckpointId: null, members: 5, eventId: null, finishTime: null, dnf: false, easy: false },
    { id: 2, name: "Group 2", penalty: [], disqualified: false, route: [], nextCheckpointId: null, members: 5, eventId: null, finishTime: null, dnf: false, easy: false }
  ]

  const returnPenalty : Penalty = {
    id: 1,
    type: "HINT",
    time: 5,
    groupId: 2,
    checkpointId: 2
  }

  test("should set groups", () => {
    const groups = [{ id: 1, name: "Test", penalty: [], disqualified: false, route: [], nextCheckpointId: null, members: 5, eventId: null, finishTime: null, dnf: false, easy: false }]
    const state = groupReducer(initialState, setGroups(groups))
    expect(state).toEqual(groups)
  })

  test("should append group", () => {
    const group = { id: 2, name: "Fernando", penalty: [], disqualified: false, route: [], nextCheckpointId: null, members: 5, eventId: null, finishTime: null, dnf: false, easy: false }
    const state = groupReducer(initialState, appendGroup(group))
    expect(state).toEqual([group])
  })

  test("should update group", () => {
    const state = [{ id: 3, name: "Hulio", penalty: [], disqualified: false, route: [], nextCheckpointId: null, members: 5, eventId: null, finishTime: null, dnf: false, easy: false }]
    const updated = { id: 3, name: "Ahulio", penalty: [], disqualified: false, route: [], nextCheckpointId: null, members: 5, eventId: null, finishTime: null, dnf: false, easy: false }
    const newState = groupReducer(state, updateGroup(updated))
    expect(newState[0].name).toBe("Ahulio")
  })

  test("fetchGroups thunk works", async () => {
    (getAllGroups as jest.Mock).mockResolvedValue(returnGroups)

    await store.dispatch<any>(fetchGroups())
    expect(store.getState().groups).toEqual(returnGroups)
  })

  test("Give penalty reducer updates group penalties and removePenaltyreducer removes it", async () => {
    (givePenalty as jest.Mock).mockResolvedValue(returnPenalty)
    // eslint-disable-next-line no-unexpected-multiline
    (removePenalty as jest.Mock)

    store.dispatch(setGroups(returnGroups))

    await store.dispatch<any>(givePenaltyReducer(2, 2, "HINT", 5))
    const updatedGroups = store.getState().groups
    expect(updatedGroups[1].penalty).toContainEqual(returnPenalty)

    await store.dispatch<any>(removePenaltyReducer(2, returnPenalty.id))
    const updatedGroupsRemoved = store.getState().groups
    expect(updatedGroupsRemoved[1].penalty).toEqual([])
  })

  test("Add group and then remove the group", async () => {
    const mockGroup = returnGroups[0]
    ;(createGroup as jest.Mock).mockResolvedValue(mockGroup)
    ;(removeGroup as jest.Mock).mockResolvedValue(mockGroup)

    await store.dispatch<any>(addGroupReducer({ name: "Group 1", members: 5, easy: false }))
    expect(store.getState().groups).toContainEqual(mockGroup)
    await store.dispatch<any>(removeGroupReducer(1))
    expect(store.getState().groups).toEqual([])
  })

  test("Should handle ndf and give next checkpoint", async () => {
    const mockGroup = returnGroups[0]
    const mockGroupCheckpoint = { ...mockGroup, nextCheckpointId: 2 }
    ;(dnfGroup as jest.Mock).mockResolvedValue(mockGroup)
    ;(giveNextCheckpoint as jest.Mock).mockResolvedValue(mockGroupCheckpoint)

    store.dispatch(setGroups(returnGroups))

    await store.dispatch<any>(dnfGroupReducer(1))
    expect(store.getState().groups[0].dnf).toBe(true)
    expect(store.getState().groups[0].nextCheckpointId).toBeNull()

    await store.dispatch<any>(giveNextCheckpointReducer(1, 2))
    expect(store.getState().groups[0].nextCheckpointId).toBe(2)
  })
})