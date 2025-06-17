import { Checkpoint, Event, Group } from "@/types"
import { sortAlphabetically, sortByStatus, sortByTime } from "../groupUtils"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

let groups: Group[]
let group1: Group
let group2: Group
let group3: Group
let group4: Group
let event: Event
let checkpoints: Checkpoint[]

beforeEach(() => {
  checkpoints = [
    {
      id: 1,
      type: "START",
      eventId: 1,
      name: "Lähtö",
      hint: null,
      easyHint: null
    },
    {
      id: 2,
      type: "INTERMEDIATE",
      eventId: 1,
      name: "Väli1",
      hint: null,
      easyHint: null
    },
    {
      id: 3,
      type: "INTERMEDIATE",
      eventId: 1,
      name: "Väli2",
      hint: null,
      easyHint: null
    },
    {
      id: 4,
      type: "FINISH",
      eventId: 1,
      name: "Maali",
      hint: null,
      easyHint: null
    }
  ]
  event = {
    id: 1,
    name: "Eventti",
    startTime: new Date("2025-06-12T07:52:31.349Z"),
    endTime: new Date("2025-06-12T11:52:31.349Z"),
    minRouteTime: 90,
    maxRouteTime: 100,
    checkpoints: [],
    penalties: [],
    group: []
  }
  group1 = {
    id: 1,
    name: "Ryhmä",
    eventId: 1,
    members: 5,
    nextCheckpointId: 1,
    finishTime: null,
    disqualified: false,
    dnf: false,
    penalty: [],
    route: checkpoints,
    easy: false
  }
  group2 = {
    id: 1,
    name: "A-ryhmä",
    eventId: 1,
    members: 5,
    nextCheckpointId: 2,
    finishTime: new Date("2025-06-12T10:52:31.349Z"),
    disqualified: false,
    dnf: false,
    penalty: [],
    route: checkpoints,
    easy: false
  }
  group3 = {
    id: 1,
    name: "D-ryhmä",
    eventId: 1,
    members: 5,
    nextCheckpointId: 2,
    finishTime: new Date("2025-06-12T09:52:31.349Z"),
    disqualified: false,
    dnf: true,
    penalty: [],
    route: checkpoints,
    easy: false
  }
  group4 = {
    id: 1,
    name: "K-ryhmä",
    eventId: 1,
    members: 5,
    nextCheckpointId: 2,
    finishTime: new Date("2025-06-12T08:52:31.349Z"),
    disqualified: true,
    dnf: false,
    penalty: [],
    route: checkpoints,
    easy: false
  }
  groups = [group1, group2, group3, group4]
})

describe("sortAlphabetically", () => {
  test("returns groups in alphabetical order", () => {
    const sortedGroups = sortAlphabetically([...groups])
    const sortedNames = sortedGroups.map(g => g.name)
    expect(sortedNames).toEqual(["A-ryhmä", "D-ryhmä", "K-ryhmä", "Ryhmä"])
  })
})

describe("sortByTime", () => {
  test("returns groups sorted by time with disqualified and dnf groups at bottom", () => {
    const sortedGroups = sortByTime([...groups], event)
    const sortedNames = sortedGroups.map(g => g.name)
    expect(sortedNames).toEqual(["A-ryhmä", "Ryhmä", "D-ryhmä", "K-ryhmä"])
  })
})

describe("sortByStatus", () => {
  test("groups are sorted by status", () => {
    const sortedGroups = sortByStatus([...groups])
    const sortedNames = sortedGroups.map(g => g.name)
    expect(sortedNames).toEqual(["A-ryhmä", "K-ryhmä", "Ryhmä", "D-ryhmä"])
  })
})
