import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Movie } from '../lib/tmdb';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import ReelsScreen from '../screens/ReelsScreen';

// importar pantalles que falten

export type RootStackParamList = {
  Home: undefined;
  Reels: undefined;
  Search: undefined;
  // afegir altres pantalles aquí (ex: Details, Profile...)
  Details: { movie: Movie }; // 👈 Afegeix aquesta línia

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reels" component={ReelsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      {/* afegir altres pantalles aquí */}
      <Stack.Screen name="Details" component={DetailsScreen} />

    </Stack.Navigator>
  );
}
