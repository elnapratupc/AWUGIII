// App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { supabase } from './screens/supabaseClient';

import HomeScreen from './screens/homescreen';
import SearchScreen from './screens/searchscreen';
import ReelsScreen from './screens/reelsscreen';
import LoginScreen from './screens/loginscreen';
import SignupScreen from './screens/signupscreen';
import DetailsScreen from './screens/detailsscreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function loadResources() {
      await Font.loadAsync({
        'LexendDeca-Regular': require('./assets/fonts/static/LexendDeca-Regular.ttf'),
        'LexendDeca-Medium': require('./assets/fonts/static/LexendDeca-Medium.ttf'),
        'LexendDeca-SemiBold': require('./assets/fonts/static/LexendDeca-SemiBold.ttf'),
        'LexendDeca-Bold': require('./assets/fonts/static/LexendDeca-Bold.ttf'),
      });
      
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session?.user);

      setFontsLoaded(true);
    }

    loadResources();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Pantallas de autenticación */}
          {!loggedIn ? (
            <>
              <Stack.Screen 
                name="LoginScreen" 
                component={LoginScreen} 
              />
              <Stack.Screen 
                name="SignupScreen" 
                component={SignupScreen} 
              />
            </>
          ) : (
            <>
              {/* Pantallas de la app */}
              <Stack.Screen 
                name="HomeScreen" 
                component={HomeScreen} 
              />
              <Stack.Screen 
                name="SearchScreen" 
                component={SearchScreen} 
              />
              <Stack.Screen 
                name="ReelsScreen" 
                component={ReelsScreen} 
              />
              <Stack.Screen 
                name="DetailsScreen" 
                component={DetailsScreen} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
