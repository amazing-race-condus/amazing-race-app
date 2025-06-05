import { styles } from "@/styles/commonStyles"
import { Link } from "expo-router"
import React from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { Entypo } from "@expo/vector-icons"

const SettingsItem = ({ text, link }: { text: string, link: string}) => {
  return (
    <Link href={link} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.checkpointName}>
            { text }
          </Text>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    </Link>
  )
}

export default SettingsItem
