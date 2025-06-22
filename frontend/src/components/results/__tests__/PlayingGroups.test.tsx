import { render, screen } from "@testing-library/react-native"
import PlayingGroups from "../PlayingGroups"
import { group, events, checkpoint } from "@/utils/testUtils"
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

const playingGroup: Group = {
  name: "Pelissä",
  id: 10103525246231,
  members: 5,
  disqualified: false,
  dnf: false,
  penalty: [],
  easy: false,
  eventId: 1,
  nextCheckpointId: 123,
  route: [checkpoint],
  finishTime: null
}

describe("<PlayingGroups />", () => {
  describe("Rendering", () => {
    test("renders nothing when no not started groups exist", () => {
      const groups = [group, finishGroup]

      render(
        <PlayingGroups groups={groups} event={mockEvent} />
      )

      expect(screen.queryByText("Peli kesken (0)")).toBeTruthy()

      expect(screen.queryByText("Voittajat")).toBeNull()
      expect(screen.queryByText("Testers")).toBeNull()
    })

    test("renders finished groups when they exist", () => {
      const groups = [group, finishGroup, playingGroup]

      render(
        <PlayingGroups groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Peli kesken (1)")).toBeTruthy()
      expect(screen.queryByText("Pelissä")).toBeTruthy()

      expect(screen.queryByText("Testers")).toBeNull()
      expect(screen.queryByText("Voittajat")).toBeNull()
    })
  })
})
