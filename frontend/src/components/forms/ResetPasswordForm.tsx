import { View, Text, TextInput, Pressable } from "react-native"
import { Stack, useRouter, useLocalSearchParams } from "expo-router"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { useRef, useState } from "react"
import { resetPassword } from "@/services/authenticationService"
import { AxiosError } from "axios"
import { setNotification } from "@/reducers/notificationSlice"

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("")
  const [passwordAgain, setPasswordAgain] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef<TextInput>(null)
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token: string }>()

  const handleResetPassword = async () => {
    if (password !== passwordAgain) {
      dispatch(setNotification("Syötetyt salasanat eivät täsmää", "error"))
      setPassword("")
      setPasswordAgain("")
      return
    }

    try {
      await resetPassword(password, token)
      dispatch(setNotification("Salasana vaihdettu onnistuneesti", "success"))
      setPassword("")
      setPasswordAgain("")
      router.replace("/login")
    } catch (error: any) {
      if (error instanceof AxiosError) {
        dispatch(
          setNotification(
            error.response?.data.error ?? `Salasanaa ei voitu vaihtaa: ${error.message}`, "error")
        )
      } else {
        dispatch(setNotification("Odottamaton virhe salasanan vaihtamisessa", "error"))
      }
    }
  }
  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text style={styles.header}>Vaihda salasana:</Text>
      <View style={styles.formContainer}>
        <Text style={styles.formText}>Anna uusi salasana:</Text>
        <TextInput
          autoFocus
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => nextRef.current?.focus()}
        />
        <Text style={styles.formText}>Anna salasana uudelleen:</Text>
        <TextInput
          ref={nextRef}
          style={styles.inputField}
          value={passwordAgain}
          onChangeText={setPasswordAgain}
          secureTextEntry
          onSubmitEditing={handleResetPassword}
          returnKeyType="done"
        />
        <Pressable style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Vaihda salasana</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default ResetPasswordForm
