import { View, Text, StyleSheet } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"

const Page = () => {
  const { id } = useLocalSearchParams()

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{title: `sivu ${ id }`}}
      />
      <Text>Page-komponentti</Text>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
})
