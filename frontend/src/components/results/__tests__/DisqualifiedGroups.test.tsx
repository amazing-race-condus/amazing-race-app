import { render, screen } from "@testing-library/react-native"
import DisqualifiedGroups from "../DisqualifiedGroups"
import { group, disqualifiedGroup, dnfGroup, events } from "@/utils/testUtils"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

const mockEvent = events[0]

describe("<DisqualifiedGroups />", () => {
  describe("Rendering", () => {
    test("renders nothing when no disqualified groups exist", () => {
      const groups = [group, dnfGroup]
      
      render(
        <DisqualifiedGroups groups={groups} event={mockEvent} />
      )

      expect(screen.queryByText(/Diskatut/)).toBeNull()
    })

    test("renders disqualified groups when they exist", () => {
      const groups = [group, dnfGroup, disqualifiedGroup]
      
      render(
        <DisqualifiedGroups groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Diskatut (1)")).toBeTruthy()
      expect(screen.getByText("Diskattavat")).toBeTruthy()
    })

    test("renders multiple disqualified groups correctly", () => {
      const disqualifiedGroup2 = { ...disqualifiedGroup, id: 2322, name: "Toinen diskattava" }
      const groups = [group, dnfGroup, disqualifiedGroup2, disqualifiedGroup]
      
      render(
        <DisqualifiedGroups groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Diskatut (2)")).toBeTruthy()
      expect(screen.getByText("Diskattavat")).toBeTruthy()
      expect(screen.getByText("Toinen diskattava")).toBeTruthy()
    })
  })
})
