import { Platform } from "react-native"
import { io } from "socket.io-client"

const URL = Platform.OS === "web"
  ? process.env.EXPO_PUBLIC_SOCKET_URL_WEB
  : process.env.EXPO_PUBLIC_SOCKET_URL_MOBILE

export const socket = io(URL)
