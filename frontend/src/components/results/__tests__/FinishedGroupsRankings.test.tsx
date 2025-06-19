import { render, screen } from "@testing-library/react-native"
import FinishedGroupsRankings from "../FinishedGroupsRankings"
import { group, disqualifiedGroup, dnfGroup, events, checkpoint } from "@/utils/testUtils"
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

describe("<FinishedGroupsRankings />", () => {
  describe("Rendering", () => {
    test("renders nothing when no finished groups exist", () => {
      const groups = [group, dnfGroup]
      
      render(
        <FinishedGroupsRankings groups={groups} event={mockEvent} />
      )

      expect(screen.queryByText("Maaliin tulleet (0)")).toBeTruthy()
      expect(screen.queryByText("Testers")).toBeNull()
      expect(screen.queryByText("Kesken")).toBeNull()

    })

    test("renders finished groups when they exist", () => {
      const groups = [group, dnfGroup, disqualifiedGroup, finishGroup]
      
      render(
        <FinishedGroupsRankings groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Maaliin tulleet (1)")).toBeTruthy()
      expect(screen.getByText("Voittajat")).toBeTruthy()
      expect(screen.getByText("1.")).toBeTruthy()

      expect(screen.queryByText("Testers")).toBeNull()
    })

    test("renders multiple disqualified groups correctly", () => {
      const groups = [group, dnfGroup, finishGroup, finishGroup2]
      
      render(
        <FinishedGroupsRankings groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Maaliin tulleet (2)")).toBeTruthy()
      expect(screen.getByText("Voittajat")).toBeTruthy()
      expect(screen.getByText("Toiset")).toBeTruthy()
      
      expect(screen.getByText("1.")).toBeTruthy()
      expect(screen.getByText("2.")).toBeTruthy()

      expect(screen.queryByText("Testers")).toBeNull()
    })
  })
})
