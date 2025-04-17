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

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log in to proceed.</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#333"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#333"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonPrimaryText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonSecondaryText}>Create an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fbf5', // schemes-background
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#171d1a', // schemes-on-background
  },
  input: {
    width: '100%',
    backgroundColor: '#eaefe9', // schemes-surface-container
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#171d1a',
  },
  buttonPrimary: {
    backgroundColor: '#206a4e', // schemes-primary
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimaryText: {
    color: '#fff', // schemes-on-primary
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
