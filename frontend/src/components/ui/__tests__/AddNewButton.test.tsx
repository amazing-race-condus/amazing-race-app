import { render, fireEvent, screen } from "@testing-library/react-native"
import AddNewButton from "../addNewButton"

describe("AddNewButton", () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders correctly", () => {
    render(<AddNewButton onPress={mockOnPress} />)

    const button = screen.getByRole("button")
    expect(button).toBeTruthy()
  })

  test("calls onPress when pressed", async () => {
    render(<AddNewButton onPress={mockOnPress} />)

    const button = screen.getByRole("button")
    fireEvent.press(button)

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})