import { View, Text, TextInput, Pressable } from "react-native"
import { Stack, router } from "expo-router"
import { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { useState } from "react"
import { setNotification } from "@/reducers/notificationSlice"
import { login } from "@/services/loginService"
import { setToken } from "@/utils/tokenUtils"
import { Checkbox } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [admin, setAdmin] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogin = async () => {
    try {
      const user = await login( username, password, admin )
      await AsyncStorage.setItem("user-info", user.token)
      setToken(user.token)
      setUsername("")
      setPassword("")
      setAdmin(false)
      dispatch(setNotification("Kirjautuminen onnistui!", "success"))
      router.replace("/")
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Kirjautuminen epäonnistui: ${error.message}`, "error"
        ))
        setUsername("")
        setPassword("")
      }
    }
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
            />
          </>
        )}
        <Text style={styles.formText}>Salasana:</Text>
        <TextInput
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirjaudu sisään</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default LoginForm