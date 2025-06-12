import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";

const Calendar = ({
  selected,
  setSelected
}: {
  selected: DateType
  setSelected: (date: DateType) => void
}) => {
  const defaultStyles = useDefaultStyles();

  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) => setSelected(date)}
      styles={defaultStyles}
      firstDayOfWeek={1}
      locale="fi"
    />
  );
}

export default Calendar