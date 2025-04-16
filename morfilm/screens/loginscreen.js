import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { supabase } from './supabaseClient';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Usamos la ruta "Home" que definimos en el Stack Navigator
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/splash-icon.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Inicia Sessió</Text>
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
        title="Iniciar Sessió"
        onPress={handleLogin}
        color="#206A4E"
      />
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        No tens compte? Registra’t
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
