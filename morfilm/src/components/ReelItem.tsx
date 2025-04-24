import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview'; // Usamos WebView para los videos de YouTube Shorts

interface ReelItemProps {
  reel: {
    id: string;
    videoUrl: string;
  };
}

// Obtener la altura de la pantalla
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ReelItem = ({ reel }: ReelItemProps) => {
  return (
    <View style={styles.reelContainer}>
      {/* Usamos WebView para móviles */}
      {Platform.OS !== 'web' ? (
        <WebView
          source={{ uri: reel.videoUrl }} // URL del video
          style={styles.video}
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo={true} // Habilita video en pantalla completa
          mediaPlaybackRequiresUserAction={false} // Permite que el video se reproduzca automáticamente

        />
      ) : (
        // Usamos un iframe para la web
        <iframe
          width="100%"
          height={windowHeight} // Ajusta la altura para que ocupe toda la pantalla
          src={reel.videoUrl}
          allow="autoplay; fullscreen"
          title={`Reel ${reel.id}`}
          style={styles.video}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reelContainer: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center', // Centra el video verticalmente
    alignItems: 'center', // Centra el video horizontalmente
    marginBottom: 10,
    borderRadius: 20, // Redondea las puntas del contenedor
    overflow: 'hidden', // Esto asegura que el contenido (video) también tenga bordes redondeados
  },
  video: {
    width: '56.25%',    
    height: windowHeight,
    objectFit: 'cover', // Asegura que el video cubra el contenedor sin deformarse
    borderRadius: 20, // Redondea las puntas del video
  },
});

export default ReelItem;