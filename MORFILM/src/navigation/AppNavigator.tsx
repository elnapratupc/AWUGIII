import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Movie } from '../lib/tmdb';
import HomeScreen from '../screens/HomeScreen';
//importar pantalles que falten

export type RootStackParamList = {
  Home: undefined;
 //afegir aqui pantalles que falten
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* afegir aqui pantalles que falten*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
