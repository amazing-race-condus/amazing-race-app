import { render, screen, fireEvent } from "@testing-library/react-native"
import Search from "../src/components/ui/Search"

describe("<Search />", () => {
  let mockSetSearch: any

  beforeEach(() => {
    mockSetSearch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("has correct placeholder text", () => {
    render(<Search search="" setSearch={mockSetSearch} />)

    const textInput = screen.getByPlaceholderText("Hae ryhmiä...")
    expect(textInput).toBeTruthy()
  })

  test("the state change is handled correctly", () => {
    const testText: string = "testing"

    render(<Search search="" setSearch={mockSetSearch} />)

    const textInput = screen.getByPlaceholderText("Hae ryhmiä...")
    fireEvent.changeText(textInput, testText)

    expect(mockSetSearch).toHaveBeenCalledWith(testText)
  })

  test("has correct text as value", () => {
    const testText: string = "testing"

    render(<Search search={ testText } setSearch={mockSetSearch} />)

    const textInput = screen.getByDisplayValue(testText)
    expect(textInput).toBeTruthy()
  })
})