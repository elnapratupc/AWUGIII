import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Movie } from '../lib/tmdb';
import HomeScreen from '../screens/HomeScreen';
// importar pantalles que falten

export type RootStackParamList = {
  Home: undefined;
  // afegir altres pantalles aquí (ex: Details, Profile...)
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* afegir altres pantalles aquí */}
    </Stack.Navigator>
  );
}
