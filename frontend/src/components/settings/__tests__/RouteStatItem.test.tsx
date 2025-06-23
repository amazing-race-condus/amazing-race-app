import { render, screen } from "@testing-library/react-native"
import RouteStatItem from "../RouteStatItem"

describe("<RouteStatItem>", () => {
  test("renders title, value, and unit", () => {
    render (
      <RouteStatItem
        title="Moi"
        value={52}
        unit="kpl"
      />
    )

    expect(screen.getByText(/Moi/)).toBeTruthy()
    expect(screen.getByText("52 kpl")).toBeTruthy()
  })

  test("renders n/a if value is null", () => {
    render (
      <RouteStatItem
        title="Moi"
        value={null}
        unit="kpl"
      />
    )

    expect(screen.getByText(/Moi/)).toBeTruthy()
    expect(screen.getByText("n/a")).toBeTruthy()
  })
})
