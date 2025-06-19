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
    expect(screen.getByText("5 kpl")).toBeTruthy()
    expect(screen.getByText(/Käytössä:/)).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  test("displays correct median route time", () => {
    render(
      <RouteStats 
        routes={mockRoutes} 
        activeRoutes={mockActiveRoutes} 
        groupsLength={5} 
      />
    )

    expect(screen.getByText(/Mediaanipituus:/)).toBeTruthy()
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

    expect(screen.getByText(/Lyhin reitti:/)).toBeTruthy()
    expect(screen.getByText("90 min")).toBeTruthy()
    expect(screen.getByText(/Pisin reitti:/)).toBeTruthy()
    expect(screen.getByText("110 min")).toBeTruthy()
  })

  test("renders no data message when no active routes exist", () => {
    render(
      <RouteStats 
        routes={mockRoutes} 
        activeRoutes={[]} 
        groupsLength={5} 
      />
    )

    expect(screen.getByText("Ei tietoja - luo reitit nähdäksesi tilastoja.")).toBeTruthy()
    expect(screen.queryByText("Reittien tilastot")).toBeNull()
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

    expect(screen.getByText(/Mediaanipituus:/)).toBeTruthy()
    expect(screen.getByText(/Lyhin reitti:/)).toBeTruthy()
    expect(screen.getByText(/Pisin reitti:/)).toBeTruthy()
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

    expect(screen.getByText(/Käytössä:/)).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("8")).toBeTruthy()
  })

  test("handles zero groups correctly", () => {
    render(
      <RouteStats 
        routes={mockRoutes} 
        activeRoutes={mockActiveRoutes} 
        groupsLength={0} 
      />
    )

    expect(screen.getByText(/Käytössä:/)).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("0")).toBeTruthy()
  })
})