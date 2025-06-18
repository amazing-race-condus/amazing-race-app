import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"

const RemoveNotification = ({handleRemove } : { handleRemove: () => void }) => {

  return(
    <>
      <Pressable style={[ styles.removeNotification, { flex: 1 } ]} onPress={() => handleRemove()}>
        <Text>X</Text>
      </Pressable>
    </>
  )
}

export default RemoveNotification