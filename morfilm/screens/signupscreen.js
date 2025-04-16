import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, Dimensions, Image } from 'react-native';
import { supabase } from './supabaseClient';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignupScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Compte creat!', 'Revisa el teu correu per verificar-lo.');
      // Navegamos a la pantalla de login usando la ruta "Login"
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/splash-icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Crea un compte</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />
      <Button
        title="Registrar-se"
        onPress={handleSignup}
        color="#206A4E"
      />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        Ja tens compte? Inicia sessió
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  link: {
    marginTop: 16,
    color: '#206A4E',
    textAlign: 'center',
  },
});
