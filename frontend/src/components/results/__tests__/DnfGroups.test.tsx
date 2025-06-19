import { render, waitFor, fireEvent, screen } from "@testing-library/react-native"
import { Provider } from "react-redux"
import testStore from "@/store/testStore"
import DnfGroups from "../DnfGroups"
import { group, disqualifiedGroup, dnfGroup, events } from "@/utils/testUtils"

jest.useFakeTimers()

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
}))

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

const mockEvent = events[0]

describe("<Groups />", () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe("Rendering", () => {
    test("renders nothing when no DNF groups exist", () => {
      const groups = [group, disqualifiedGroup]
      
      render(
        <DnfGroups groups={groups} event={mockEvent} />
      )

      expect(screen.queryByText(/Keskeyttäneet/)).toBeNull()
    })

    test("renders DNF groups when they exist", () => {
      const groups = [group, dnfGroup, disqualifiedGroup]
      
      render(
        <DnfGroups groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Keskeyttäneet (1)")).toBeTruthy()
      expect(screen.getByText("Kesken")).toBeTruthy()
    })

    test("renders multiple DNF groups correctly", () => {
      const dnfGroup2 = { ...dnfGroup, id: 2322, name: "Toinen kesken" }
      const groups = [group, dnfGroup, dnfGroup2, disqualifiedGroup]
      
      render(
        <DnfGroups groups={groups} event={mockEvent} />
      )

      expect(screen.getByText("Keskeyttäneet (2)")).toBeTruthy()
      expect(screen.getByText("Kesken")).toBeTruthy()
      expect(screen.getByText("Toinen kesken")).toBeTruthy()
    })
  })
})
