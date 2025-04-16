import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { supabase } from './screens/supabaseClient';

import HomeScreen from './screens/homescreen';
import LoginScreen from './screens/loginscreen';
import SignupScreen from './screens/signupscreen';
import DetailsScreen from './screens/detailsscreen'; // New: Details screen

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const loadResources = async () => {
      await Font.loadAsync({
        'LexendDeca-Regular': require('./assets/fonts/static/LexendDeca-Regular.ttf'),
        'LexendDeca-Medium': require('./assets/fonts/static/LexendDeca-Medium.ttf'),
        'LexendDeca-SemiBold': require('./assets/fonts/static/LexendDeca-SemiBold.ttf'),
        'LexendDeca-Bold': require('./assets/fonts/static/LexendDeca-Bold.ttf'),
      });

      const { data: { session } } = await supabase.auth.getSession();
      setInitialRoute(session?.user ? 'Home' : 'Login');
      setFontsLoaded(true);
    };

    loadResources();
  }, []);

  if (!fontsLoaded || !initialRoute) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
