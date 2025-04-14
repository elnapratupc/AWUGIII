import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.topBar}>
          <Icon name="account-circle" size={64} color="#171d1a" />
          <Icon name="settings" size={32} color="#171d1a" />
        </View>

        <Text style={styles.welcome}>Welcome.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#eaeaea', // fons de fons (per simular el navegador)
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#f5fbf5',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    marginTop: 24,
    fontSize: 24,               // ✅ fontSize correcte
    fontFamily: 'Lexend Deca',  // ✅ font del tema
    fontWeight: '400',          // Regular
    color: '#171d1a',
  }
  
});

export default HomeScreen;
