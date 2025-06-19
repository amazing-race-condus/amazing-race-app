import { render, screen } from "@testing-library/react-native"
import NotStartedGroups from "../NotStartedGroups"
import { group, dnfGroup, events, checkpoint } from "@/utils/testUtils"
import { Group } from "@/types"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

const mockEvent = events[0]

const finishGroup: Group = {
  name: "Voittajat",
  id: 1010353225246231,
  members: 5,
  disqualified: false,
  dnf: false,
  penalty: [],
  easy: false,
  eventId: 1,
  nextCheckpointId: null,
  route: [checkpoint],
  finishTime: new Date("2025-06-25 22:00:00")
}

const finishGroup2: Group = {
  name: "Toiset",
  id: 1010353225246231,
  members: 5,
  disqualified: false,
  dnf: false,
  penalty: [],
  easy: false,
  eventId: 1,
  nextCheckpointId: null,
  route: [checkpoint],
  finishTime: new Date("2026-06-25 22:00:00")
}

describe("<NotStartedGroups />", () => {
  describe("Rendering", () => {
    test("renders nothing when no not started groups exist", () => {
      const groups = [finishGroup, finishGroup2]

      render(
        <NotStartedGroups groups={groups} event={mockEvent} />
      )

      expect(screen.queryByText("Eivät aloittaneet (0)")).toBeTruthy()

      expect(screen.queryByText("Voittajat")).toBeNull()
      expect(screen.queryByText("Toiset")).toBeNull()
    })

    test("renders finished groups when they exist", () => {
      const groups = [group, finishGroup, finishGroup2]

      render(
        <NotStartedGroups groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Eivät aloittaneet (1)")).toBeTruthy()
      expect(screen.queryByText("Testers")).toBeTruthy()
      expect(screen.queryByText("Voittajat")).toBeNull()
      expect(screen.queryByText("Toiset")).toBeNull()
    })
  })
})
