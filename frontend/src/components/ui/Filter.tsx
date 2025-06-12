import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { Dimensions } from "react-native"

const screenWidth = Dimensions.get("window").width

const Filter = ({ order, setOrder, values=["Aakkosjärjestys", "Aika", "Status"] }: { order: number, setOrder: (num: number) => void, values?: string[] }) => {
  return (
    <SegmentedControl
      testID="RNCSegmentedControl"
      values={values}
      sliderStyle={{ borderRadius: 15, backgroundColor: "grey" }}
      backgroundColor="white"
      style={{
        height: 45,
        borderRadius: 16,
        width: Math.min(screenWidth * 0.9, 355),
      }}
      fontStyle={{ color: "black", fontWeight: "400" }}
      activeFontStyle={{ color: "black", fontWeight: "500" }}
      selectedIndex={order}
      onChange={(event) => {
        setOrder(event.nativeEvent.selectedSegmentIndex)
      }}
    />
  )
}

export default Filter
