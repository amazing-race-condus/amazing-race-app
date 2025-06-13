import { Group } from "@/types"
import { FontAwesome } from "@expo/vector-icons"
import { View, Text, StyleSheet } from "react-native"

const StatusBadge = ({ group }: { group: Group }) => {
  const getGroupStatus = (group: Group): { label: string; color: string } | null => {
    if (group.disqualified) return { label: "DSQ", color: "purple" }
    if (group.nextCheckpointId && group.route) {
      if (group.nextCheckpointId === group.route[0].id) return { label: "DNS", color: "orange" }
    }
    if (group.dnf) return { label: "DNF", color: "red" }
    if (group.finishTime) return { label: "FIN", color: "green" }
    return null
  }

  const status = getGroupStatus(group)

  if (!status) return null

  return (
    <View style={[localStyles.badge, { backgroundColor: status.color }]}>
      {status.label === "FIN" ? (
        <FontAwesome name="flag-checkered" size={12} color="white" />
      ) : null }
      <Text style={localStyles.badgeText}>{status.label}</Text>
    </View>
  )
}

export default StatusBadge

const localStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
})