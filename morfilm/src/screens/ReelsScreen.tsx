import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import ReelItem from '../components/ReelItem'; 
import HeaderBar from '../components/HeaderBar'; 
import FooterNav from '../components/FooterNav'; 

const windowHeight = Dimensions.get('window').height; // Altura de la pantalla para ajustar el tamaño de los reels

export default function ReelsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Ejemplo de datos de reels
  const [reels, setReels] = useState([
    { id: '1', videoUrl: 'https://youtube.com/shorts/7NlR7Mxy2DU?si=6XaH3AdGMt-0Y3u-' },
    { id: '2', videoUrl: 'https://youtube.com/shorts/TqWAARTMCOE?si=Ze1AxzSk7tZ6sBoh' },
    { id: '3', videoUrl: 'https://www.youtube.com/embed/m_ZkvNxSmRI' },
    // Agrega más objetos de reels según lo necesario
  ]);

  // Función que maneja la navegación a detalles de un reel
  const handleSelectReel = (reel: { id: string; videoUrl: string }) => {
    navigation.navigate('ReelDetails', { reel });
  };

  const renderReel = ({ item }: { item: { id: string; videoUrl: string } }) => (
    <TouchableOpacity onPress={() => handleSelectReel(item)}>
      <ReelItem reel={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderBar />

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
    backgroundColor: '#f5fbf5',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
});