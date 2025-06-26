import { View, Text, TextInput, Pressable } from "react-native"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { useRef, useState } from "react"
import { Checkbox } from "react-native-paper"
import { loginUser } from "@/reducers/userSlice"
import { handleAlert } from "@/utils/handleAlert"
import { sendResetPasswordMail } from "@/services/authenticationService"
import { AxiosError } from "axios"
import { setNotification } from "@/reducers/notificationSlice"

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

  const handleResetPassword = () => {
    handleAlert({
      confirmText: "Lähetä",
      title: "Salasanan palautus",
      message:
        "Linkki salasanan vaihtamista varten lähetetään pääkäyttäjän sähköpostiin. Ongelmatilanteessa tarkista roskapostikansio.",
      onConfirm: async () => {
        try {
          await sendResetPasswordMail()
          dispatch(setNotification("Sähköposti lähetetty onnistuneesti.", "success"))
        } catch (error: any) {
          if (error instanceof AxiosError) {
            dispatch(
              setNotification(
                error.response?.data.error ?? `Sähköpostia ei voitu lähettää: ${error.message}`, "error")
            )
          } else {
            dispatch(setNotification("Odottamaton virhe salasanan palautuksessa.", "error"))
          }
        }
      },
    })
  }

  return (
    <View style={styles.content}>
      <Text style={styles.header}>Kirjaudu sisään:</Text>
      <View style={styles.formContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            testID="admin-checkbox"
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
              testID="username"
            />
          </>
        )}
        <Text style={styles.formText}>Salasana:</Text>
        <TextInput
          ref={passwordInputRef}
          style={[styles.inputField, { color: "black" }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
          returnKeyType="done"
          testID="password"
        />

        <Pressable style={({ pressed }) => [styles.button, {opacity: pressed ? 0.5 : 1 }]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Kirjaudu sisään</Text>
        </Pressable>
        {admin && (
          <>
            <Pressable
              onPress={handleResetPassword}
              style={({ pressed }) => [{
                backgroundColor: "orange",
                padding: 8,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 10
              }, {
                opacity: pressed ? 0.5 : 1
              }]}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Unohtuiko salasana?</Text>
            </Pressable></>
        )}
      </View>
    </View>
  )
}

export default LoginForm
