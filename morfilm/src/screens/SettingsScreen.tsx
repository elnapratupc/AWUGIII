import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Menu, Divider } from 'react-native-paper';
import FooterNav from '../components/FooterNav';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../lib/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [themeChoice, setThemeChoice] = useState('System default'); // system / light / dark

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleThemeChange = (theme: string) => {
    setThemeChoice(theme);
    closeMenu();
    // Aquí podries implementar el canvi real de tema si vols
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate('Login'); // Torna al login després de logout
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.optionRow}>
        <View style={styles.optionLeft}>
          <Icon name="theme-light-dark" size={24} color={colors.text} style={styles.optionIcon} />
          <Text style={styles.optionText}>Appearance</Text>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
              <Text style={styles.menuButtonText}>{themeChoice}</Text>
              <Icon name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => handleThemeChange('System default')} title="System default" />
          <Menu.Item onPress={() => handleThemeChange('Light')} title="Light" />
          <Menu.Item onPress={() => handleThemeChange('Dark')} title="Dark" />
        </Menu>
      </View>

      <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
        <View style={styles.optionLeft}>
          <Icon name="logout" size={24} color={colors.text} style={styles.optionIcon} />
          <Text style={styles.optionText}>Log out</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <FooterNav active="" /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lexend Deca',
    fontWeight: '400',
    marginBottom: 32,
    color: '#171d1a',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Lexend Deca',
    color: '#171d1a',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4eae4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  menuButtonText: {
    marginRight: 8,
    fontSize: 14,
    fontFamily: 'Lexend Deca',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
