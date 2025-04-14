import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../theme/typography';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.topBar}>
        <Icon name="account-circle-outline" size={30} color="#171d1a" />
        <Icon name="cog-outline" size={30} color="#171d1a" />
          </View>

        <Text style={textStyles.headlineSmall}>
        Welcome.
        </Text>

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
 
  
});

export default HomeScreen;
