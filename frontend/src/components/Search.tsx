import { TextInput, StyleSheet, Dimensions, View } from "react-native"
// import FontAwesome from "@expo/vector-icons/FontAwesome"

const screenWidth = Dimensions.get("window").width

const Search = (
  {search, setSearch, placeHolder="Hae ryhmiä..."}:
  {search: string, setSearch: React.Dispatch<React.SetStateAction<string>>, placeHolder?: string}
) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={setSearch}
        value={search}
        placeholder={placeHolder}
        placeholderTextColor="grey"
      />
    </View>
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
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingRight: 20,
    backgroundColor: "white",
    fontSize: 16,
  }
})
