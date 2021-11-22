import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './screens/home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux'
import store  from './redux/store';


export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation/>
      <FlashMessage/>
    </SafeAreaProvider>
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
