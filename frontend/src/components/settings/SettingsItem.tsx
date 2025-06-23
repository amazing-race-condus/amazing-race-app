import { styles } from "@/styles/commonStyles"
import { Link } from "expo-router"
import React from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { Entypo } from "@expo/vector-icons"

const SettingsItem = ({ text, link, dimmed=false }: { text: string, link: string, dimmed?: boolean}) => {
  const style = dimmed ? styles.dimmedItem : styles.item

  return (
    <Link href={link} asChild role="link">
      <TouchableOpacity style={style} testID="button">
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
