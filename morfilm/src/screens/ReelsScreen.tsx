import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { supabase } from '../lib/supabaseClient';
import ReelItem from '../components/ReelItem';
import HeaderBar from '../components/HeaderBar';
import FooterNav from '../components/FooterNav';

const windowHeight = Dimensions.get('window').height;

export default function ReelsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const [reels, setReels] = useState([
    { id: '1', videoUrl: 'https://www.youtube.com/embed/m_ZkvNxSmRI' },
    { id: '2', videoUrl: 'https://www.youtube.com/embed/epvUIWtZ7TI' },
    { id: '3', videoUrl: 'https://www.youtube.com/embed/SKKSz29BR5Q' },
    { id: '4', videoUrl: 'https://www.youtube.com/embed/hKekLRO-RR8' },
    { id: '5', videoUrl: 'https://www.youtube.com/embed/KP7ZdEe_8iE' },
    { id: '6', videoUrl: 'https://www.youtube.com/embed/QO7vY4HpBdw' },
    // Afegir més reels
  ]);

  const renderReel = ({ item }: { item: { id: string; videoUrl: string } }) => (
    <View style={styles.reelContainer}>
      <ReelItem reel={item} />
    </View>
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar onLogout={handleLogout} showWelcome={false} />

      <FlatList
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      />

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  reelContainer: {
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
