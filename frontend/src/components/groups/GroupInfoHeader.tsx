import React from "react"
import { View, Text, StyleSheet } from "react-native"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Feather from "@expo/vector-icons/Feather"
import { Group } from "@/types"

const GroupInfoHeader = (
  { group, totalPenalty }:
  { group: Group, totalPenalty: number }
) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <FontAwesome6 name="user-group" size={20} color="#4CAF50" />
        <Text style={styles.statLabel}>Jäsenet</Text>
        <Text style={styles.statValue}>{group?.members}</Text>
      </View>
      <View style={styles.statItem}>
        <FontAwesome6 name="clock" size={20} color="#2196F3" />
        <Text style={styles.statLabel}>Aika</Text>
        <Text style={styles.statValue}>--:--</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="x-octagon" size={20} color="#FF5722" />
        <Text style={styles.statLabel}>Rankut</Text>
        <Text style={styles.statValue}>{totalPenalty}min</Text>
      </View>
      <View style={styles.statItem}>
        {group.easy
          ? <><Feather name="check" size={20} color="green" />
            <Text style={styles.statLabel}>Helpotettu</Text>
            <Text style={styles.statValue}>Päällä</Text></>
          : <><Feather name="x" size={20} color="red" />
            <Text style={styles.statLabel}>Helpotettu</Text>
            <Text style={styles.statValue}>Pois</Text></>}
      </View>
    </View>
  )
}

export default GroupInfoHeader

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    fontWeight: "500",
  },
  statValue: {
    color: "white",
    fontWeight: "bold",
    marginTop: 2,
  }
})
