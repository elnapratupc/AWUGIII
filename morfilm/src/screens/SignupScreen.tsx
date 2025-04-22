import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';
import AuthInput from '../components/AuthInput';
import FooterNav from '../components/FooterNav';

export default function SignupScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignup = async () => {
    setEmailError('');
    setPasswordError('');

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
      setEmailError('Enter a valid email (example@email.com)');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Account created!', 'Check your email to verify it.');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5fbf5' }}>
      {/* Header */}
      <View style={styles.topBar}>
        <View />
        <Icon name="cog-outline" size={24} color="#171d1a" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create an account to proceed</Text>

        <AuthInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={!!emailError}
          errorMessage={emailError}
        />
        <AuthInput
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={!!passwordError}
        />
        <AuthInput
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={!!passwordError}
          errorMessage={passwordError}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignup}>
          <Text style={styles.buttonPrimaryText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonSecondaryText}>Back to Log in</Text>
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
