import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { NativeRouter, Route, Routes, Navigate, Link } from 'react-router-native'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const url =
  Platform.OS === 'web'
    ? process.env.EXPO_PUBLIC_BACKEND_URL_WEB
    : process.env.EXPO_PUBLIC_BACKEND_URL

console.log(url)

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
}

const Frontpage = ({ data=null }) => {
  return (
    <View style={styles.content}>
      <Text>Frontpage-komponentti</Text>
      <Text>Hello EETu!</Text>
      <Text>{data ? `Response: ${data}` : 'Loading...'}</Text>
      <Button
        title="Test Pipeline" onPress={pipeline}
      />
      <Text>Palvelimen vastaus: {data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const Page2 = () => {
  return (
    <View style={styles.content}>
      <Text>Page2-komponentti</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const Page3 = () => {
  return (
    <View style={styles.content}>
      <Text>Page3-komponentti</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const DefaultPage = () => {
  return (
    <View style={styles.content}>
      <Text>Sivua ei löytynyt.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const Main = ({data=null}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Condus Amazing Race App</Text>
      <Routes>
        <Route path="/" element={<Frontpage data={data} />} />
        <Route path="/frontpage" element={<Frontpage data={data} />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/defaultpage" element={<DefaultPage />} />
        <Route path="*" element={<Navigate to="/defaultpage" replace />} />
      </Routes>
      <Link style={styles.link} to="/frontpage"><Text>Etusivu</Text></Link>
      <Link style={styles.link} to="/page2"><Text>Sivu 2</Text></Link>
      <Link style={styles.link} to="/page3"><Text>Sivu 3</Text></Link>
    </View>
  );
}

export default function App() {
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
  }, [url]);

  return (
    <>
      <NativeRouter>
        <Main data={data} />
      </NativeRouter>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    paddingBottom: 20,
    backgroundColor: '#2d3f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    margin: 10,
    fontSize: 30,
    fontWeight: '600',
    color: '#fcba03',
  },
  link: {
    margin: 1,
    padding: 6,
    borderWidth: 1,
    backgroundColor: '#abbbd4',
    width: '90%',
  },
  content: {
    flex: 1,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
});
