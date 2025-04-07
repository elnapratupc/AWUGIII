import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Importamos los iconos de Material Design

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>  {/* Aplica el estilo aquí */}
      <View style={styles.iconList}>
        {/* Aquí vamos a listar varios iconos con contorno */}
        <Icon name="home-outline" size={50} color="black" /> {/* Icono vacío de casa */}
        <Icon name="settings-outline" size={50} color="black" /> {/* Icono vacío de configuración */}
        <Icon name="account-circle" size={50}  /> {/* Icono vacío de perfil */}
        <Icon name="search-outline" size={50} color="black" /> {/* Icono vacío de búsqueda */}
        <Icon name="favorite-outline" size={50} color="black" /> {/* Icono vacío de favorito */}
        <Icon name="local-fire-department" size={50} color="black" />  {/* Icono vacío de fuego */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Colocamos justifyContent aquí
    padding: 20,
    backgroundColor: '#fff',
  },
  iconList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',  // Ajuste de iconos
  },
});

export default HomeScreen;
