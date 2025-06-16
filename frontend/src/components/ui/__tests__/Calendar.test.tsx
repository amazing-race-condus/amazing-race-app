import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import Calendar from "../Calendar"
import DateTimePicker from "react-native-ui-datepicker"

describe("Calendar component", () => {
  it("calls setSelected when a new date is selected", () => {
    const mockSetSelected = jest.fn()
    const mockDate = new Date(2025, 5, 16)

    const { getByTestId } = render(
      <Calendar selected={mockDate} setSelected={mockSetSelected} />
    )

    const wrapper = getByTestId("calendar-wrapper")
    const picker = wrapper.findByType(DateTimePicker)

    fireEvent(picker, "onChange", {
      nativeEvent: {},
      type: "set",
      date: new Date(2025, 6, 1),
    })

    expect(mockSetSelected).toHaveBeenCalledWith(new Date(2025, 6, 1))
  })
})
