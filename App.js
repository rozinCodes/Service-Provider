import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
