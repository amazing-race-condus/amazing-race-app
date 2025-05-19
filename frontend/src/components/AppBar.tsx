import { useState } from 'react'
import { View, StyleSheet, Text, Pressable, Modal, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from 'expo-router'
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight + 56,
  },
  menu: {
    backgroundColor: '#2d3f5c',
    borderRadius: 0,
    padding: 10,
    elevation: 4,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    color: 'white'
  }
})

type AppBarProps = {
  pageTitle: string
}

const AppBar = ({ pageTitle }: AppBarProps) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const router = useRouter()

  const handlePress = (target: string) => {
    setMenuVisible(false)
    router.push(target)
  }

  return (
    <>
      <View style={styles.appBar}>
        {/* Menu Button */}
        <Pressable onPress={() => setMenuVisible(true)} style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="white" />
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>{ pageTitle }</Text>

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

      {/* Menu */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => handlePress('/')} style={styles.menuItem}>
              <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('/add_checkpoint')} style={styles.menuItem}>
              <Text style={styles.text}>Lisää rasti</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress('/checkpoints')} style={styles.menuItem}>
              <Text style={styles.text}>Rastit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

export default AppBar