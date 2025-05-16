import { View, StyleSheet, Text, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Constants from "expo-constants"

const styles = StyleSheet.create({
  appBar: {
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#2d3f5c"
  },
  iconButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  actions: {
    flexDirection: "row",
    alignItems: "center"
  }
})

const AppBar = () => {
  return (
    <View style={styles.appBar}>
      {/* Menu Button */}
      <Pressable onPress={() => alert("Menu")} style={styles.iconButton}>
        <Ionicons name="menu" size={24} color="white" />
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Title</Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable onPress={() => alert("Notification")} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </Pressable>
        <Pressable onPress={() => alert("Settings")} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  )
}

export default AppBar