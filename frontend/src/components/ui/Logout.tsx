import React from "react"
import { setToken } from "@/utils/tokenUtils"
import { Text, Pressable } from "react-native"
import { setNotification } from "@/reducers/notificationSlice"
import { User } from "@/types"
import { useDispatch } from "react-redux"
import { styles } from "@/styles/commonStyles"
import { AppDispatch } from "@/store/store"

const Logout = ({setUser}: { setUser: React.Dispatch<React.SetStateAction<User | undefined>> }) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = () => {
    setUser(undefined)
    setToken("")
    window.localStorage.clear()
    dispatch(setNotification("Olet nyt kirjautunut ulos", "success"))
  }

  return <Pressable style={styles.button} onPress={handleLogout}>
    <Text style={styles.buttonText}>Kirjaudu ulos</Text>
  </Pressable>
}

export default Logout