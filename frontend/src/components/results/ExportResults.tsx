import { Button, Platform, View, Text } from "react-native"
import { Event } from "@/types"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import exportResult from "@/utils/exportUtil"
import { setNotification } from "@/reducers/notificationSlice"

const ExportResults = () => {
  const dispatch = useDispatch<AppDispatch>()
  const event = useSelector((state: RootState) => state.event)

  const exportResultsWeb = async (event: Event) => {
    const blob = await exportResult(event)
    if (!blob) {
      dispatch(setNotification("Tulosten lataaminen ei onnistunut", "error"))
    }
    const url = URL.createObjectURL(blob!)

    const link = document.createElement("a")
    link.href = url
    link.download = "tulokset.docx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    (event.endTime && <View style={{ marginVertical: 10 }}>
      {Platform.OS === "web"
        ? <Button title="Lataa tulokset (.docx)" onPress={() => exportResultsWeb(event)} />
        : <Text style={{color:"white"}}>Tulosten lataaminen on mahdollista vain selaimessa</Text>
      }
    </View>)
  )
}

export default ExportResults
