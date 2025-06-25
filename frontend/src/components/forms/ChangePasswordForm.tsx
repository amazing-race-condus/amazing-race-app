import React, { useRef, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { TextInput } from "react-native-gesture-handler"
import { handleAlert } from "@/utils/handleAlert"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { setNotification } from "@/reducers/notificationSlice"
import { AxiosError } from "axios"
import { changePassword } from "@/services/authenticationService"

const ChangePasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const confirmPasswordInputRef = useRef<TextInput>(null)

  const handlePasswordChange = async () => {
    handleAlert({
      confirmText: "Vaihda salasana",
      title: "Vahvista salasanan vaihto",
      message: "Salasanan vaihtaminen kirjaa kaikki tavalliset käyttäjät ulos. Haluatko jatkaa?",
      onConfirm: async () => {
        try {
          await changePassword(password, confirmPassword)
          dispatch(setNotification("Salasana vaihdettu.", "success"))
        } catch (error) {
          if (error instanceof AxiosError) {
            dispatch(setNotification(
              error.response?.data.error ?? `Salasanaa ei voitu vaihtaa: ${error.message}`,
              "error"
            ))
          }
        } finally {
          setPassword("")
          setConfirmPassword("")
        }
      }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vaihda tavallisen käyttäjän salasana:</Text>
      <View style={styles.formContainer}>
        <Text style={styles.formText}>Uusi salasana:</Text>
        <TextInput
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={() => {
            confirmPasswordInputRef.current?.focus()
          }}
          submitBehavior="submit"
          returnKeyType="next"
        />
        <Text style={styles.formText}>Vahvista salasana:</Text>
        <TextInput
          ref={confirmPasswordInputRef}
          style={styles.inputField}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          onSubmitEditing={handlePasswordChange}
          returnKeyType="done"
        />

        <Pressable style={({ pressed }) => [styles.button, {opacity: pressed ? 0.5 : 1 }]} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Vaihda</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default ChangePasswordForm
