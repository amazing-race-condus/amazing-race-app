import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL

  const [data, setData] = useState(null);

  useEffect(() => {
    const getPong = async () => {
      try {
        const response = await fetch(`${url}/ping`);
        const result = await response.text();
        setData(result.message || JSON.stringify(result));
      } catch (error) {
        console.error(error);
      }
    };

    getPong();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
      <Text>{data ? `Response: ${data}` : 'Loading...'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
