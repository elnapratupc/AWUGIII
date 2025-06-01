import React, { useState, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { supabase } from '../lib/supabaseClient';
import ReelItem from '../components/ReelItem';
import HeaderBar from '../components/HeaderBar';
import FooterNav from '../components/FooterNav';

const { height } = Dimensions.get('window');

export default function ReelsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const [activeReelId, setActiveReelId] = useState<string | null>(null);

  const reels = [
    { id: '1', videoUrl: 'https://www.youtube.com/embed/m_ZkvNxSmRI?controls=1&modestbranding=1&rel=0' },
    { id: '2', videoUrl: 'https://www.youtube.com/embed/epvUIWtZ7TI?controls=1&modestbranding=1&rel=0' },
    { id: '3', videoUrl: 'https://www.youtube.com/embed/SKKSz29BR5Q?controls=1&modestbranding=1&rel=0' },
    { id: '4', videoUrl: 'https://www.youtube.com/embed/hKekLRO-RR8?controls=1&modestbranding=1&rel=0' },
    { id: '5', videoUrl: 'https://www.youtube.com/embed/KP7ZdEe_8iE?controls=1&modestbranding=1&rel=0' },
    { id: '6', videoUrl: 'https://www.youtube.com/embed/QO7vY4HpBdw?controls=1&modestbranding=1&rel=0' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderReel = useCallback(({ item }: { item: { id: string; videoUrl: string } }) => (
    <View style={styles.reelContainer}>
      <ReelItem
        key={item.id}
        reel={item}
        isActive={activeReelId === item.id}
        onPlay={() => setActiveReelId(item.id)}
      />
    </View>
  ), [activeReelId]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar
        onLogout={handleLogout}
        showWelcome={false}
        onPressSettings={() => navigation.navigate('SettingsScreen')}
      />

      <FlatList
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        extraData={activeReelId}
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
    paddingBottom: 0,
  },
  reelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
});
 