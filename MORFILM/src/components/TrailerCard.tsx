import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TrailerCard({ trailer }) {
  const youtubeThumbnail = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;

  return (
    <View style={styles.card}>
      <Image source={{ uri: youtubeThumbnail }} style={styles.thumbnail} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{trailer.movieTitle}</Text>
          <Text style={styles.date}>
            {trailer.published_at
              ? new Date(trailer.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}>
          <Icon name="play-circle-outline" size={24} color="#171d1a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: '#e4eae4',
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171d1a',
  },
  date: {
    fontSize: 12,
    color: '#404943',
  },
});
