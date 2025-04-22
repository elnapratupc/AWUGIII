import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MovieCard({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie)}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.poster} />
      <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
      <Text style={styles.date}>
        {new Date(movie.release_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    backgroundColor: '#e4eae4',
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginBottom: 8,
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
