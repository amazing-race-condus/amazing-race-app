import { Stack } from "expo-router"
import { Provider } from "react-redux"
import store from "@/store/store"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "@react-navigation/native"
import { useEffect } from "react"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { getDefaultEventReducer } from "@/reducers/eventSlice"

function DataRefreshProvider({ children }: { children: React.ReactNode }) {

  store.dispatch(getDefaultEventReducer())

  useEffect(() => {
    const refreshData = async () => {
      const eventId = await store.getState().event.id
      if (eventId) {
        await Promise.all([
          store.dispatch(fetchGroups(eventId)),
          store.dispatch(fetchCheckpoints(eventId))
        ])
      }
    }

    refreshData()

    const interval = setInterval(refreshData, 10000)

    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}

export const unstable_settings = {
  initialRouteName: "/(tabs)/(groups)/index",
}

export default function RootLayout() {
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
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </DataRefreshProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}