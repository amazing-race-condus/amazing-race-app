import { render, screen } from "@testing-library/react-native"
import RouteStats from "../RouteStats"
import { RouteInfo } from "@/types"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

describe("<RouteStats />", () => {
  const mockRoutes: RouteInfo[] = [
    { id: 1, routeTime: 90 },
    { id: 2, routeTime: 100 },
    { id: 3, routeTime: 110 },
    { id: 4, routeTime: 120 },
    { id: 5, routeTime: 130 }
  ]

  const mockActiveRoutes: RouteInfo[] = [
    { id: 1, routeTime: 90 },
    { id: 2, routeTime: 100 },
    { id: 3, routeTime: 110 }
  ]

  test("renders route statistics when active routes exist", () => {
    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={mockActiveRoutes}
        groupsLength={5}
      />
    )

    expect(screen.getByText("Reittien tilastot")).toBeTruthy()
    expect(screen.getByText(/Reittien lukumäärä:/)).toBeTruthy()
    expect(screen.queryAllByText("5 kpl")).toHaveLength(2)
    expect(screen.getByText(/Käytössä/)).toBeTruthy()
    expect(screen.getByText("3 kpl")).toBeTruthy()
  })

  test("displays correct median route time", () => {
    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={mockActiveRoutes}
        groupsLength={5}
      />
    )

    expect(screen.queryAllByText(/Mediaanipituus:/)).toHaveLength(2)
    expect(screen.getByText("100 min")).toBeTruthy()
  })

  test("displays shortest and longest route times", () => {
    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={mockActiveRoutes}
        groupsLength={5}
      />
    )

    expect(screen.queryAllByText(/Lyhin reitti:/)).toHaveLength(2)
    expect(screen.queryAllByText("90 min")).toHaveLength(2)
    expect(screen.queryAllByText(/Pisin reitti:/)).toHaveLength(2)
    expect(screen.getByText("130 min")).toBeTruthy()
  })

  test("handles single active route correctly", () => {
    const singleActiveRoute: RouteInfo[] = [{ id: 1, routeTime: 95 }]

    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={singleActiveRoute}
        groupsLength={3}
      />
    )

    expect(screen.getAllByText("95 min")).toHaveLength(3)
  })

  test("handles even number of active routes for median calculation", () => {
    const evenActiveRoutes: RouteInfo[] = [
      { id: 1, routeTime: 80 },
      { id: 2, routeTime: 90 },
      { id: 3, routeTime: 100 },
      { id: 4, routeTime: 110 }
    ]

    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={evenActiveRoutes}
        groupsLength={6}
      />
    )

    expect(screen.getByText("100 min")).toBeTruthy()
  })

  test("displays correct usage ratio", () => {
    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={mockActiveRoutes}
        groupsLength={8}
      />
    )

    expect(screen.getByText(/Käytössä/)).toBeTruthy()
    expect(screen.getByText("3 kpl")).toBeTruthy()
    expect(screen.getByText("8 kpl")).toBeTruthy()
  })

  test("handles zero groups correctly", () => {
    render(
      <RouteStats
        routes={mockRoutes}
        activeRoutes={mockActiveRoutes}
        groupsLength={0}
      />
    )

    expect(screen.getByText(/Käytössä/)).toBeTruthy()
    expect(screen.getByText("3 kpl")).toBeTruthy()
    expect(screen.getByText("0 kpl")).toBeTruthy()
  })
})