import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../lib/supabaseClient';
import AuthInput from '../components/AuthInput';
import FooterNav from '../components/FooterNav';

export default function LoginScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Enter a valid email (example@email.com)');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes('invalid login')) {
        setPasswordError('Incorrect password');
      } else {
        Alert.alert('Login error', error.message);
      }
    }

    // No cal navigation.replace('Home'), App.tsx ja ho gestiona
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5fbf5' }}>
      {/* Top bar amb icona de configuració */}
      <View style={styles.topBar}>
        <View />
        <Icon name="cog-outline" size={24} color="#171d1a" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log in to proceed.</Text>

        <AuthInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={!!emailError}
          errorMessage={emailError}
        />

        <AuthInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={!!passwordError}
          errorMessage={passwordError}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <Text style={styles.buttonPrimaryText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonSecondaryText}>Create an account</Text>
        </TouchableOpacity>
      </ScrollView>

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#171d1a',
    alignSelf: 'flex-start',
  },
  buttonPrimary: {
    backgroundColor: '#206a4e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimaryText: {
    color: '#fff',
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
