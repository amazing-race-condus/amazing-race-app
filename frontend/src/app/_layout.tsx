import { Stack } from "expo-router"
import { Provider, useDispatch, useSelector } from "react-redux"
import store, { AppDispatch, RootState } from "@/store/store"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { getDefaultEventReducer } from "@/reducers/eventSlice"
import Notification from "@/components/ui/Notification"
import { loadUserFromStorage } from "@/reducers/userSlice"

function DataRefreshProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  const user = useSelector((state: RootState) => state.user)
  if (user.token) {
    store.dispatch(getDefaultEventReducer())
  }

  useEffect(() => {
    const refreshData = async () => {
      const eventId = store.getState().event.id
      if (eventId) {
        await Promise.all([
          store.dispatch(fetchGroups(eventId)),
          store.dispatch(fetchCheckpoints(eventId))
        ])
      }
    }

    refreshData()
    setIsReady(true)

    const interval = setInterval(refreshData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}

function AppContent() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <DataRefreshProvider>
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
          regular: {
            fontFamily: "System",
            fontWeight: "normal",
          },
          medium: {
            fontFamily: "System",
            fontWeight: "600",
          },
          bold: {
            fontFamily: "System",
            fontWeight: "bold",
          },
          heavy: {
            fontFamily: "System",
            fontWeight: "900",
          },
        }
      }}>
        <Notification />
        <Stack>
          <Stack.Protected guard={Boolean(user.token)}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={!(user.token)}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </DataRefreshProvider>
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