import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TrailerCard({ trailer }) {
  const youtubeThumbnail = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;

  return (
    <View style={styles.card}>
      <Image source={{ uri: youtubeThumbnail }} style={styles.thumbnail} />
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {trailer.movieTitle}
          </Text>
          <Text style={styles.date}>
            {trailer.published_at
              ? new Date(trailer.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Tonight'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}
        >
          <Icon name="play" size={20} color="#171d1a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: '#f5fbf5', // mateix fons que l'app
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171d1a',
  },
  date: {
    fontSize: 12,
    color: '#404943',
    marginTop: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dff3e0', // verd clar
    alignItems: 'center',
    justifyContent: 'center',
  },
});
