import React from "react"
import { Text, Pressable } from "react-native"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"
import { logoutUser } from "@/reducers/userSlice"
import { storageUtil } from "@/utils/storageUtil"

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    await storageUtil.removeEventId()
    dispatch(logoutUser())
  }

  return <Pressable style={({ pressed }) => [styles.logoutbutton, {marginTop: 50, opacity: pressed ? 0.5 : 1 }]} onPress={handleLogout}>
    <Text style={styles.buttonText}>Kirjaudu ulos</Text>
  </Pressable>
}

export default Logout
