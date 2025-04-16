// components/footerNav.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function FooterNav() {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      {/* Botón Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home-outline" size={24} color="#171d1a" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Botón Search */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Search')}
      >
        <Icon name="magnify" size={24} color="#171d1a" />
        <Text style={styles.navText}>Search</Text>
      </TouchableOpacity>

      {/* Botón Reels */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Reels')}
      >
        <Icon name="movie-roll" size={24} color="#171d1a" />
        <Text style={styles.navText}>Reels</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    marginTop: 2,
    fontSize: 12,
    color: '#171d1a',
  },
});
