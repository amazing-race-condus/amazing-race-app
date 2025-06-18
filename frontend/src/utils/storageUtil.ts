import AsyncStorage from "@react-native-async-storage/async-storage"
import { User } from "@/types"

const STORAGE_KEY = "user"
const EVENT_ID_KEY = "eventId"

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

  async setEventId(id: number): Promise<void> {
    try {
      const eventId = JSON.stringify(id)
      await AsyncStorage.setItem(EVENT_ID_KEY, eventId)
    } catch (error) {
      console.error("Failed to save eventId to storage:", error)
      throw error
    }
  },

  async getEventId(): Promise<number | null> {
    try {
      const value = await AsyncStorage.getItem(EVENT_ID_KEY)
      if (value !== null) {
        return value ? parseInt(value, 10) : null
      }
      return null
    } catch (error) {
      console.error("Failed to load eventId from storage:", error)
      throw error
    }
  },

  async removeEventId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(EVENT_ID_KEY)
    } catch (error) {
      console.error("Failed to remove user from storage:", error)
      throw error
    }
  },
}
