import { styles } from "@/styles/commonStyles"
import { Group } from "@/types"
import { Text } from "react-native"

const GroupStatusDisplay = ({ group }: { group: Group }) => {
  return (
    <>
      <Text
        style={[ styles.title,
          { textDecorationLine: (group?.disqualified || group?.dnf) ? "line-through" : "none",
            maxWidth: "70%"
          }
        ]}
      >
        {group?.name}
      </Text>

      {group?.disqualified && (
        <Text style={[styles.breadText, { color: "#f54254", fontWeight: "bold" }]}>
          DISKATTU
        </Text>
      )}

      {group?.dnf && (
        <Text style={[styles.breadText, { color: "#f54254", fontWeight: "bold" }]}>
          SUORITUS KESKEYTETTY
        </Text>
      )}
    </>
  )
}

export default GroupStatusDisplay
