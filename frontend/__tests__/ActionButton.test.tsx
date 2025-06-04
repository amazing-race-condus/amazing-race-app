import { render, screen, fireEvent } from "@testing-library/react-native"
import ActionButton from "@/components/ActionButton"

describe("<ActionButton />", () => {
  let mockOnPress: any

  beforeEach(() => {
    mockOnPress = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("the button can be pressed", () => {
    render(<ActionButton onPress={mockOnPress} text="Moi" />)

    const button = screen.getByText("Moi")
    fireEvent.press(button)

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  test("the button renders the correct text", () => {
    render(<ActionButton onPress={mockOnPress} text="Ei" />)

    const button = screen.getByText("Ei")
    expect(button).toBeDefined()
  })
})