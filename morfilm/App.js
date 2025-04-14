import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import HomeScreen from './screens/homescreen';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'LexendDeca-Regular': require('./assets/fonts/static/LexendDeca-Regular.ttf'),
      'LexendDeca-Medium': require('./assets/fonts/static/LexendDeca-Medium.ttf'),
      'LexendDeca-SemiBold': require('./assets/fonts/static/LexendDeca-SemiBold.ttf'),
      'LexendDeca-Bold': require('./assets/fonts/static/LexendDeca-Bold.ttf'),

    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null; // Espera a que es carreguin les fonts

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
};

export default App;
