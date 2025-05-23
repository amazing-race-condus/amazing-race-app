import { useState } from "react"
import { SafeAreaView, TextInput, StyleSheet, Dimensions, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
// import FontAwesome from "@expo/vector-icons/FontAwesome"

const screenWidth = Dimensions.get("window").width

const Search = () => {
  const [search, setSearch] = useState<string>("")

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.layout}>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={setSearch}
            value={search}
            placeholder="Hae ryhmiä..."
            placeholderTextColor="#888"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Search

// todo: add to styles directory later
const styles = StyleSheet.create({
  layout: {
    marginTop: 10,
  },
  input: {
    height: 50,
    width: Math.min(screenWidth * 0.9, 355),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 20,
    backgroundColor: "white",
    fontSize: 16,
  }
})