import React from "react"
import { Text, Pressable } from "react-native"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { logoutUser } from "@/reducers/userSlice"

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    dispatch(logoutUser())
  }

  return <Pressable style={styles.button} onPress={handleLogout}>
    <Text style={styles.buttonText}>Kirjaudu ulos</Text>
  </Pressable>
}

export default Logout
