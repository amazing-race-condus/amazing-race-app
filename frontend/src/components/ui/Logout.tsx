import React from "react"
import { setToken } from "@/utils/tokenUtils"
import { Text, Pressable } from "react-native"
import { setNotification } from "@/reducers/notificationSlice"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user-info")
    } catch (error) {
      // todo: better error handling
      console.error(error)
    }
    setToken("")
    dispatch(setNotification("Olet nyt kirjautunut ulos", "success"))
  }

  return <Pressable style={styles.button} onPress={handleLogout}>
    <Text style={styles.buttonText}>Kirjaudu ulos</Text>
  </Pressable>
}

export default Logout
