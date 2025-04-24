import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { supabase } from '../lib/supabaseClient';
import ReelItem from '../components/ReelItem'; 
import HeaderBar from '../components/HeaderBar'; 
import FooterNav from '../components/FooterNav'; 

const windowHeight = Dimensions.get('window').height; // Altura de la pantalla para ajustar el tamaño de los reels

export default function ReelsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  // Links de reels
  const [reels, setReels] = useState([
    { id: '1', videoUrl: 'https://www.youtube.com/embed/m_ZkvNxSmRI' },
    { id: '2', videoUrl: 'https://www.youtube.com/embed/epvUIWtZ7TI'},
    { id: '3', videoUrl: 'https://www.youtube.com/embed/SKKSz29BR5Q' },
    { id: '4', videoUrl: 'https://www.youtube.com/embed/hKekLRO-RR8' },
    { id: '5', videoUrl: 'https://www.youtube.com/embed/KP7ZdEe_8iE'},
    { id: '6', videoUrl: 'https://www.youtube.com/embed/QO7vY4HpBdw' },
    // Afegir mes reels
  ]);

  const renderReel = ({ item }: { item: { id: string; videoUrl: string } }) => (
    <ReelItem reel={item} /> // Usamos el componente ReelItem para renderizar cada video
  );

  const handleLogout = async () => {
      await supabase.auth.signOut();
    };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar onLogout={handleLogout} showWelcome={false} />

      {/* Lista de reels */}
      <FlatList
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled={true} // Permite desplazarse por cada "página" de reels
        showsVerticalScrollIndicator={false} // Desactiva la barra de desplazamiento vertical
        contentContainerStyle={styles.scrollContainer}
      />

      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#f5fbf5',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
});