import AsyncStorage from "@react-native-async-storage/async-storage"
import { User } from "@/types"

const STORAGE_KEY = "user"

export const storageUtil = {
  // User-related storage operations
  async setUser(user: User): Promise<void> {
    try {
      const jsonUser = JSON.stringify(user)
      await AsyncStorage.setItem(STORAGE_KEY, jsonUser)
    } catch (error) {
      console.error("Failed to save user to storage:", error)
      throw error
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userInfo = await AsyncStorage.getItem(STORAGE_KEY)
      return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
      console.error("Failed to load user from storage:", error)
      throw error
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to remove user from storage:", error)
      throw error
    }
  },
}
