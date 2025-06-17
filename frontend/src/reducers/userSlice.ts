import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "@/store/store"
import { login } from "@/services/loginService"
import { setNotification } from "./notificationSlice"
import type { User } from "@/types"
import { storageUtil } from "@/utils/storageUtil"

const initialState: User = {
  id: 0,
  token: "",
  username: "",
  admin: false
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload
    },
    clearUser() {
      return initialState
    }
  },
})

export const loginUser = (username: string, password: string, admin: boolean) =>
  async (dispatch: AppDispatch) => {
    try {
      const user = await login(username, password, admin)
      storageUtil.setUser(user)
      dispatch(setUser(user))
      dispatch(setNotification("Kirjautuminen onnistui", "success"))
      return user
    } catch (error) {
      console.error(error)
      dispatch(setNotification("Kirjautuminen epäonnistui", "error"))
    }
  }

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await storageUtil.removeUser()
    dispatch(clearUser())
    dispatch(setNotification("Olet nyt kirjautunut ulos", "success"))
  } catch (error) {
    console.error("Logout error:", error)
    dispatch(setNotification("Uloskirjautuminen epäonnistui", "error"))
  }
}

export const loadUserFromStorage = () => async (dispatch: AppDispatch) => {
  try {
    const user = await storageUtil.getUser()
    if (user) {
      dispatch(setUser(user))
    }
  } catch (error) {
    // todo: error notification idk
    console.error("Failed to load user from storage:", error)
  }
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer