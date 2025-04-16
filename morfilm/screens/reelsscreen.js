import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FooterNav from '../components/footerNav';

export default function ReelsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.text}>Contenido de Reels</Text>
        {/* Aquí puedes agregar el componente de reels o videos */}
      </ScrollView>
      <FooterNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollContent: { 
    flex: 1, 
    padding: 16 
  },
  text: { 
    fontSize: 20 
  },
});
