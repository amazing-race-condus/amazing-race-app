import { render, screen } from "@testing-library/react-native"
import GameStartItem from "../GameStartItem"

describe("GameStartItem", () => {
  test("renders the text prop", () => {
    render(
      <GameStartItem text="Test Item" checkBoolean={true} />
    )
    expect(screen.getByText("• Test Item")).toBeTruthy()
  })

  test("shows check icon when checkBoolean is true", () => {
    render(
      <GameStartItem text="Checked" checkBoolean={true} />
    )
    expect(screen.getByTestId("check-icon")).toBeTruthy()
  })

  test("shows times icon when checkBoolean is false", () => {
    render(
      <GameStartItem text="Unchecked" checkBoolean={false} />
    )
    expect(screen.getByTestId("times-icon")).toBeTruthy()
  })
})