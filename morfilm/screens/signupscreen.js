import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from './supabaseClient';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignupScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Les contrasenyes no coincideixen');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }, // Guarda el nickname a Supabase
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Compte creat!', 'Revisa el teu correu per verificar-lo.');
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an account to proceed</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#333"
      />
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholderTextColor="#333"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#333"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#333"
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignup}>
        <Text style={styles.buttonPrimaryText}>Create an account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonSecondaryText}>Back to Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fbf5', // igual que `schemes-background`
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#171d1a', // `schemes-on-background`
  },
  input: {
    width: '100%',
    backgroundColor: '#eaefe9', // `schemes-surface-container`
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#171d1a',
  },
  buttonPrimary: {
    backgroundColor: '#206a4e', // `schemes-primary`
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimaryText: {
    color: '#fff', // `schemes-on-primary`
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    borderColor: '#206a4e',
    borderWidth: 1.5,
    paddingVertical: 14,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondaryText: {
    color: '#206a4e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
