import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker"
import { View } from "react-native"

const Calendar = ({
  selected,
  setSelected
}: {
  selected: DateType
  setSelected: (date: DateType) => void
}) => {
  const defaultStyles = useDefaultStyles()

  return (
    <View testID="calendar-wrapper">
      <DateTimePicker
        mode="single"
        date={selected}
        onChange={({ date }) => setSelected(date)}
        styles={defaultStyles}
        firstDayOfWeek={1}
        locale="fi"
      />
    </View>
  )
}

export default Calendar