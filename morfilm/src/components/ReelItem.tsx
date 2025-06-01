import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface ReelItemProps {
  reel: {
    id: string;
    videoUrl: string;
  };
  isActive: boolean;
  onPlay: () => void;
}

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ReelItem = ({ reel, isActive, onPlay }: ReelItemProps) => {
  const [key, setKey] = useState(Math.random().toString());

  // Reinicia el vídeo quan deixa de ser actiu
  useEffect(() => {
    if (!isActive) {
      setKey(Math.random().toString()); // força remuntatge per aturar vídeo
    }
  }, [isActive]);

  return (
    <View style={styles.reelContainer}>
      {Platform.OS !== 'web' ? (
        <WebView
          key={key}
          source={{ uri: reel.videoUrl }}
          style={styles.video}
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={onPlay}
        />
      ) : (
        <iframe
          key={key}
          width="100%"
          height="100%"
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
    width: windowWidth * 0.95,
    height: windowHeight * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 24,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default ReelItem;
