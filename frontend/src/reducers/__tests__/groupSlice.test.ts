import groupReducer, { setGroups, appendGroup, updateGroup } from "../groupSlice"
import type { Group } from "@/types"

describe("groupSlice reducers", () => {
  const initialState: Group[] = []

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
})