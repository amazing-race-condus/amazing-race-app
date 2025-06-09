import { render, screen, fireEvent } from "@testing-library/react-native"
import Filter from "../Filter"

describe("<Filter />", () => {
  let mockSetOrder: jest.Mock

  beforeEach(() => {
    mockSetOrder = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders all three filter options", () => {
    render(<Filter order={0} setOrder={mockSetOrder} />)

    const segmentedControl = screen.getByTestId("RNCSegmentedControl")
    expect(segmentedControl.props.values).toContain("Aakkosjärjestys")
    expect(segmentedControl.props.values).toContain("Aika")
    expect(segmentedControl.props.values).toContain("Status")
  })

  test("has correct initial selected index", () => {
    render(<Filter order={1} setOrder={mockSetOrder} />)

    const segmentedControl = screen.getByTestId("RNCSegmentedControl")
    expect(segmentedControl.props.selectedIndex).toBe(1)
  })

  test("calls setOrder when segment is changed", () => {
    render(<Filter order={0} setOrder={mockSetOrder} />)

    const segmentedControl = screen.getByTestId("RNCSegmentedControl")
    fireEvent(segmentedControl, "onChange", {
      nativeEvent: { selectedSegmentIndex: 2 }
    })

    expect(mockSetOrder).toHaveBeenCalledWith(2)
  })

  test("updates selected index when order prop changes", () => {
    const { rerender } = render(<Filter order={0} setOrder={mockSetOrder} />)

    let segmentedControl = screen.getByTestId("RNCSegmentedControl")
    expect(segmentedControl.props.selectedIndex).toBe(0)

    rerender(<Filter order={2} setOrder={mockSetOrder} />)

    segmentedControl = screen.getByTestId("RNCSegmentedControl")
    expect(segmentedControl.props.selectedIndex).toBe(2)
  })
})