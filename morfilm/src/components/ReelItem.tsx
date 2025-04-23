import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Video from 'react-native-video'; // Usa este paquete para reproducir videos

interface ReelItemProps {
  reel: {
    id: string;
    videoUrl: string;
  };
}

const ReelItem = ({ reel }: ReelItemProps) => {
  return (
    <View style={styles.reelContainer}>
      <Video
        source={{ uri: reel.videoUrl }} // URL del video
        style={styles.video}
        controls={true} // Mostrar controles de video
        resizeMode="cover"
        repeat
        autoplay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reelContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default ReelItem;