import { Stack } from "expo-router"
import { Provider, useDispatch, useSelector } from "react-redux"
import store, { AppDispatch, RootState } from "@/store/store"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { getDefaultEventReducer, getEventReducer } from "@/reducers/eventSlice"
import Notification from "@/components/ui/Notification"
import { loadUserFromStorage } from "@/reducers/userSlice"
import { storageUtil } from "@/utils/storageUtil"
import { socket } from "@/websocket/config"
import { cleanupGroupHandlers, setupGroupHandlers } from "@/websocket/groupSocket"
import { cleanupCheckpointHandlers, setupCheckpointHandlers } from "@/websocket/checkpointSocket"
import { cleanupEventHandlers, setupEventHandlers } from "@/websocket/eventSocket"
import { cleanupPenaltyHandlers, setupPenaltyHandlers } from "@/websocket/penaltySocket"
import { fetchEvents } from "@/reducers/allEventsSlice"

function AppContent() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)
  const eventId = useSelector((state: RootState) => state.event.id)
  const [userLoaded, setUserLoaded] = useState(false)
  const [eventInitialized, setEventInitialized] = useState(false)

  useEffect(() => {
    dispatch(loadUserFromStorage()).finally(() => setUserLoaded(true))
  }, [dispatch])

  useEffect(() => {
    if (!userLoaded) return

    if (!user.token) {
      setEventInitialized(true)
      return
    }

    const initializeEvent = async () => {
      try {
        const storageEventId = await storageUtil.getEventId()
        if (storageEventId) {
          await dispatch(getEventReducer(storageEventId))
        } else {
          await dispatch(getDefaultEventReducer())
        }
      } catch (error) {
        console.error("Failed to initialize event:", error)
      } finally {
        setEventInitialized(true)
      }
    }

    initializeEvent()
  }, [userLoaded, user.token, dispatch])

  useEffect(() => {
    if (!eventInitialized || !eventId || !user.token) {
      return
    }

    const fetchEventData = async () => {
      try {
        await Promise.all([
          dispatch(fetchGroups(eventId)),
          dispatch(fetchCheckpoints(eventId)),
          dispatch(fetchEvents()),
        ])
      } catch (error) {
        console.error(`Failed to fetch data for event ${eventId}:`, error)
      }
    }

    fetchEventData()
    setupGroupHandlers(socket)
    setupCheckpointHandlers(socket)
    setupEventHandlers(socket)
    setupPenaltyHandlers(socket)
    const intervalId = setInterval(fetchEventData, 90000)

    return () => {
      clearInterval(intervalId)
      cleanupGroupHandlers(socket)
      cleanupCheckpointHandlers(socket)
      cleanupEventHandlers(socket)
      cleanupPenaltyHandlers(socket)
      socket.off("connect")
      socket.off("disconnect")
    }
  }, [eventInitialized, eventId, user.token, dispatch])

  if (!userLoaded || !eventInitialized) {
    return null
  }

  return (
    <ThemeProvider value={{
      dark: false,
      colors: {
        primary: "black",
        background: "#003366",
        card: "white",
        text: "black",
        border: "white",
        notification: "white",
      },
      fonts: {
        regular: { fontFamily: "System", fontWeight: "normal" },
        medium: { fontFamily: "System", fontWeight: "600" },
        bold: { fontFamily: "System", fontWeight: "bold" },
        heavy: { fontFamily: "System", fontWeight: "900" },
      }
    }}>
      <Notification />
      <Stack>
        <Stack.Protected guard={Boolean(user.token)}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!user.token}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="resetpassword/[token]" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  )
}