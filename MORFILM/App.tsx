import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { MorfilmLightTheme, MorfilmDarkTheme } from './src/theme/morfilmTheme';
import { supabase } from './src/lib/supabaseClient';

import AppNavigator from './src/navigation/AppNavigator'; // Pantalles quan estàs loguejat
import AuthStack from './src/navigation/AuthStack';       // Login + Signup

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? MorfilmDarkTheme : MorfilmLightTheme;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) return null;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        {session ? <AppNavigator /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
}
