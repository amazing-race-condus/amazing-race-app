import { logoutUser } from "@/reducers/userSlice"
import { AppDispatch } from "@/store/store"
import { router } from "expo-router"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const LogoutTab = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(logoutUser())
    router.replace("/")
  }, [dispatch])

  return null
}

export default LogoutTab
