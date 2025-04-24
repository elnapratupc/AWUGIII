import React, { useEffect, useState } from 'react';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { MorfilmLightTheme, MorfilmDarkTheme } from './src/theme/morfilmTheme';
import { supabase } from './src/lib/supabaseClient';

import AppNavigator from './src/navigation/AppNavigator'; // Pantallas cuando estás logueado
import AuthStack from './src/navigation/AuthStack'; // Login + Signup

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? MorfilmDarkTheme : MorfilmLightTheme;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('SESSION:', session); // Verifica la sesión
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', session); // Verifica el cambio de sesión
      setSession(session);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        {session ? <AppNavigator /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
