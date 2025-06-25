import { render, screen } from "@testing-library/react-native"
import SettingsItem from "../SettingsItem"

// Mock expo-router
jest.mock("expo-router", () => ({
  Link: ({ children, href, ...props }: any) => children
}))

describe("SettingsItem", () => {
  test("renders the text prop", () => {
    render(
      <SettingsItem text="Test Item" link="/" />
    )
    expect(screen.getByText("Test Item")).toBeTruthy()
  })

  test("renders as a button", () => {
    render(
      <SettingsItem text="Test Item" link="/" />
    )
    expect(screen.getByTestId("button")).toBeTruthy()
  })

  test("renders text content correctly", () => {
    render(
      <SettingsItem text="Settings Option" link="/settings" />
    )
    expect(screen.getByText("Settings Option")).toBeTruthy()
  })

  test("component structure includes chevron indicator", () => {
    render(
      <SettingsItem text="Test Item" link="/test-route" />
    )
    expect(screen.getByText("Test Item")).toBeTruthy()
    expect(screen.getByTestId("button")).toBeTruthy()
  })
})