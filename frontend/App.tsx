import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL

  const [data, setData] = useState(null);

  const pipeline = async () => {
    // try {
    //   const response = await fetch(`${url}/pipeline`);
    //   const result = await response.json();
    //   alert(result.message || JSON.stringify(result));
    // } catch (error) {
    //   alert('Error fetching pipeline');
    //   console.error(error);
    // }

    try {
      const response = await fetch(`${url}/pipeline`);
      const result = await response.json(); // parse as JSON

      if (Array.isArray(result)) {
        const messages = result.map(item => item.message || JSON.stringify(item)).join('\n');
        alert(messages);
      } else {
        alert(result.message || JSON.stringify(result));
      }
    } catch (error) {
      alert('Error fetching pipeline');
      console.error(error);
    }
  };

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
      <Text>Hello EETu!</Text>
      <Text>{data ? `Response: ${data}` : 'Loading...'}</Text>
      <Button
        title="Test Pipeline" onPress={pipeline}
      />
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
