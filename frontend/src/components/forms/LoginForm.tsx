import { View, Text, TextInput, Pressable } from "react-native"
import { Stack } from "expo-router"
import { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { useState } from "react"
import { User } from "@/types"
import { setNotification } from "@/reducers/notificationSlice"
import { login } from "@/services/loginService"
import { setToken } from "@/utils/tokenUtils"

const LoginForm = ({setUser}: { setUser: React.Dispatch<React.SetStateAction<User | undefined>> }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const handleLogin = async () => {
    try {
      const user = await login( username, password )
      window.localStorage.setItem(
        "loggedAmazingRaceAppUser", JSON.stringify(user)
      )
      setToken(user.token)
      setUsername("")
      setPassword("")
      setUser(user)
      dispatch(setNotification("Kirjautuminen onnistui!", "success"))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <Text style={styles.formText}>Käyttäjätunnus:</Text>
        <TextInput
          style={styles.inputField}
          value={username}
          onChangeText={setUsername}
        />
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