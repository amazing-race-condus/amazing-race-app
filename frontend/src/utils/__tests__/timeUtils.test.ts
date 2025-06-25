import { Event, Group } from "@/types"
import { getRaceTime } from "../timeUtils"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("getRaceTime", () => {
  test("with event that doesn't have a startTime, return null", () => {
    const event: Event = {
      id: 1,
      name: "Eventti",
      startTime: null,
      endTime: null,
      minRouteTime: 90,
      maxRouteTime: 100,
      eventDate: new Date()
    }

    const group: Group = {
      id: 1,
      name: "Ryhmä",
      eventId: 1,
      members: 5,
      nextCheckpointId: 2,
      finishTime: null,
      disqualified: false,
      dnf: false,
      penalty: [],
      route: [],
      easy: false
    }

    const raceTime = getRaceTime(group, event)
    expect(raceTime).toEqual(null)
  })

  test("event with endTime and startTime + group with no finishTime returns endTime-StartTime", () => {
    const event: Event = {
      id: 1,
      name: "Eventti",
      startTime: new Date("2025-06-12T07:52:31.349Z"),
      endTime: new Date("2025-06-12T09:52:31.349Z"),
      minRouteTime: 90,
      maxRouteTime: 100,
      eventDate: new Date()
    }

    const group: Group = {
      id: 1,
      name: "Ryhmä",
      eventId: 1,
      members: 5,
      nextCheckpointId: 2,
      finishTime: null,
      disqualified: false,
      dnf: false,
      penalty: [],
      route: [],
      easy: false
    }

    const raceTime = getRaceTime(group, event)
    expect(raceTime).toEqual(7200)
  })

  test("event with startTime + group with finishTime returns finishTime-startTime if event has later endTime", () => {
    const event: Event = {
      id: 1,
      name: "Eventti",
      startTime: new Date("2025-06-12T07:52:31.349Z"),
      endTime: new Date("2025-06-12T09:52:31.349Z"),
      minRouteTime: 90,
      maxRouteTime: 100,
      eventDate: new Date()
    }

    const group: Group = {
      id: 1,
      name: "Ryhmä",
      eventId: 1,
      members: 5,
      nextCheckpointId: 2,
      finishTime: new Date("2025-06-12T08:52:31.349Z"),
      disqualified: false,
      dnf: false,
      penalty: [],
      route: [],
      easy: false
    }

    const raceTime = getRaceTime(group, event)
    expect(raceTime).toEqual(3600)
  })

  test("if event endTime is before group finishTime, returns event endTime-startTime", () => {
    const event: Event = {
      id: 1,
      name: "Eventti",
      startTime: new Date("2025-06-12T07:52:31.349Z"),
      endTime: new Date("2025-06-12T09:52:31.349Z"),
      minRouteTime: 90,
      maxRouteTime: 100,
      eventDate: new Date()
    }

    const group: Group = {
      id: 1,
      name: "Ryhmä",
      eventId: 1,
      members: 5,
      nextCheckpointId: 2,
      finishTime: new Date("2025-06-12T10:52:31.349Z"),
      disqualified: false,
      dnf: false,
      penalty: [],
      route: [],
      easy: false
    }

    const raceTime = getRaceTime(group, event)
    expect(raceTime).toEqual(7200)
  })
})