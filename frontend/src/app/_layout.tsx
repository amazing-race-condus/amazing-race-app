import { Stack } from "expo-router"
import { Provider } from "react-redux"
import store from "@/store/store"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { getEventReducer } from "@/reducers/eventSlice"
import AsyncStorage from "@react-native-async-storage/async-storage"

const EVENT_ID = 1

function DataRefreshProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const refreshData = () => {
      store.dispatch(fetchGroups())
      store.dispatch(fetchCheckpoints())
      store.dispatch(getEventReducer(EVENT_ID))
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

export default function RootLayout() {
  const [userToken, setUserToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user-info")
        setUserToken(userJson)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load user token:", error)
        setIsLoading(false)
      }
    }
    loadToken()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
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
            <Stack>
              <Stack.Protected guard={Boolean(userToken)}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Protected guard={Boolean(!userToken)}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>
          </ThemeProvider>
        </DataRefreshProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}