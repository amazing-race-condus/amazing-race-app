import { View, Text, TextInput, Pressable } from "react-native"
import { Stack } from "expo-router"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { useRef, useState } from "react"
import { Checkbox } from "react-native-paper"
import { loginUser } from "@/reducers/userSlice"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [admin, setAdmin] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const passwordInputRef = useRef<TextInput>(null)

  const handleLogin = async () => {
    await dispatch(loginUser(username, password, admin))
    setUsername("")
    setPassword("")
    setAdmin(false)
  }

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text style={styles.header}>Kirjaudu sisään:</Text>
      <View style={styles.formContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={admin ? "checked" : "unchecked"}
            onPress={() => setAdmin(!admin)}
          />
          <Text>Kirjaudu pääkäyttäjänä</Text>
        </View>
        {admin && (
          <>
            <Text style={styles.formText}>Käyttäjätunnus:</Text>
            <TextInput
              style={styles.inputField}
              value={username}
              onChangeText={setUsername}
              onSubmitEditing={() => {
                passwordInputRef.current?.focus()
              }}
              submitBehavior="submit"
              returnKeyType="next"
            />
          </>
        )}
        <Text style={styles.formText}>Salasana:</Text>
        <TextInput
          ref={passwordInputRef}
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirjaudu sisään</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default LoginForm