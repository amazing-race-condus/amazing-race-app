import React, { useEffect, useState } from 'react'
import { Text, View, Button } from 'react-native'
import { Link, Stack } from 'expo-router'
import { styles } from "../styles/commonStyles"
// import AppBar from './components/AppBar'

const url = process.env.EXPO_PUBLIC_BACKEND_URL

const pipeline = async () => {
  try {
    const response = await fetch(`${url}/pipeline`)
    const result = await response.json()

    if (Array.isArray(result)) {
      const messages = result.map(item => item.message || JSON.stringify(item)).join('\n')
      alert(messages)
    } else {
      alert(result.message || JSON.stringify(result))
    }
  } catch (error) {
    alert('Error fetching pipeline')
    console.error(error)
  }
}

const App = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const getPong = async () => {
      try {
        const response = await fetch(`${url}/ping`)
        const result = await response.text()
        setData(result.message || JSON.stringify(result))
      } catch (error) {
        console.error(error)
      }
    }

    getPong()
  }, [])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text style={styles.header}>Condus Amazing Race App</Text>
      <Text>Frontpage-komponentti</Text>
      <Text>Hello ARNi!</Text>
      <Text>{data ? `Response: ${data}` : 'Loading...'}</Text>
      <Button
        title="Test Pipeline" onPress={pipeline}
      />
      <Text>Palvelimen vastaus: {data}</Text>
      <Link style={styles.link} href="/page/3">Sivu 3</Link>
      <Link style={styles.link} href="/page/1">Sivu 1</Link>
    </View>
  )
}

export default App
