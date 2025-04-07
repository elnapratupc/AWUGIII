//https://www.figma.com/design/LGJmOwBrURlk4xYNH15mmX/Prototip-AWUGIII?node-id=39-15561&t=y3FzRbd2wninaYHL-4
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from './supabaseClient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Has iniciado sesión');
      // Redirige a la pantalla principal
    }
  };

  const handleSignupRedirect = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in to proceed.</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignupRedirect}>
        <Text style={styles.signupText}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F7F4',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#E3E5E1',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#215D4F',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  signupBtn: {
    borderWidth: 1,
    borderColor: '#215D4F',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  signupText: {
    color: '#215D4F',
    fontSize: 16,
  },
});
